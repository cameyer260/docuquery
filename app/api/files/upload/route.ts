import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3client } from "@/s3/client";
import { getPdfPreview } from "@/utils/pdf-to-image";
import { prisma } from "@/prisma/client";

export async function POST(req: NextRequest) {
  // bool variables to mark checkppoints in the upload process. used for error handling so I know where to delete from if an upload fails
  let postgresFile = false;
  let postgresPreview = false;
  let awsFile = false;
  let awsPreview = false;
  try {
    // handle auth up top
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json(
        { error: "User is not authorized to make the request." },
        { status: 401 },
      );
    const userId = session?.user?.id;

    // TODO add rate limiting here

    // harvest the formdata. expect file and name
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;
    // currently only support pdfs
    if (file.type != "application/pdf") return NextResponse.json({ error: "We currently only support PDF file uploads. Please upload a PDF file instead." }, { status: 415 });
    const filename = `user-${userId}/docs/${name}`;

    // convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // first check if the user has already uploaded a file with that name
    const exists = await prisma.document.findFirst({
      where: {
        userId: userId,
        name: name,
      },
    });
    if (exists) return NextResponse.json({ error: "Please choose a unique file name, you already have one under that name." }, { status: 409 });

    // create image preview to upload with the doc itself
    const previewBuffer = await getPdfPreview(fileBuffer);

    // all tests passed, upload the file and preview to postgres then s3
    // first save the pdf to document table
    const pdf = await prisma.document.create({
      data: {
        userId: userId,
        name: name,
      },
    });
    postgresFile = true;

    // then save the preview to the table
    await prisma.preview.create({
      data: {
        documentId: pdf.id,
      },
    });
    postgresPreview = true;

    // then upload the document to s3
    const putFileCommand = new PutObjectCommand({
      Bucket: "docuquery-files",
      Key: filename,
      Body: fileBuffer,
      ContentType: file.type,
    });
    await s3client.send(putFileCommand);
    awsFile = true;

    // finally we can upload the image buffer to s3
    const previewName = `user-${userId}/previews/${formData.get("name")}`;
    const putPreviewCommand = new PutObjectCommand({
      Bucket: "docuquery-files",
      Key: previewName,
      Body: previewBuffer,
      ContentType: file.type,
    });
    await s3client.send(putPreviewCommand);
    awsPreview = true;

    // TDOO now upload it to pinecone, embed it there and then upload in vector db as well

    return NextResponse.json({ payload: "Successfully uploaded the file." }, { status: 200 });

  } catch (error) {
    console.error(error);

    // if one upload fails, any of the successful uploads now need to be deleted. we can use these checkpoint variables that indicate which uploads happened and which did not
    if (postgresFile) {

    }
    if (postgresPreview) {

    }
    if (postgresFile) {

    }
    if (postgresPreview) {

    }

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
