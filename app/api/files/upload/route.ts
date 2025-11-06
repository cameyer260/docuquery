import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3client } from "@/s3/client";
import { getPdfPreview } from "@/utils/pdf-to-image";
import { prisma } from "@/prisma/client";

export async function POST(req: NextRequest) {
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
        name: name,
      },
    });
    if (exists) return NextResponse.json({ error: "Please choose a unique file name, you already have one under that name." }, { status: 409 });


    // otherwise all tests passed, upload the file to postgres then s3
    // TODO pickup here. save document name and preview to the db accordingly

    // upload to s3
    const putFileCommand = new PutObjectCommand({
      Bucket: "docuquery-files",
      Key: filename,
      Body: fileBuffer,
      ContentType: file.type,
    });
    await s3client.send(putFileCommand);

    // create image preview upload it
    const previewBuffer = await getPdfPreview(fileBuffer);

    // finally we can upload the image buffer to s3
    const previewName = `user-${userId}/previews/${formData.get("name")}`;
    const putPreviewCommand = new PutObjectCommand({
      Bucket: "docuquery-files",
      Key: previewName,
      Body: previewBuffer,
      ContentType: file.type,
    });
    await s3client.send(putPreviewCommand);

    // TDOO now upload it to pinecone, embed it there and then upload in vector db as well

    return NextResponse.json({ payload: "Successfully uploaded the file." }, { status: 200 });

  } catch (error) {
    console.error(error);
    // TODO
    // if one upload fails, we need to delete the others that were uploaded as well
    // if the image preview generation or upload fails we need to remove the file from s3
    // if the vector upload failed then we need to remove the file and image preview from s3
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
