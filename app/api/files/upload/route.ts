import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3client } from "@/s3/client";
import { getPdfPreview } from "@/utils/pdf-to-image";
import { prisma } from "@/prisma/client";

export async function POST(req: NextRequest) {
  // bool variables to mark checkppoints in the upload process. used for error handling so I know where and what to delete if an upload fails
  let postgresFile: { userId: string, name: string } | null = null; // holds postgresfile necessary info for delete
  let postgresPreview: string | null = null; // holds the documentId
  let awsFile: string | null = null;
  let awsPreview: string | null = null;
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
    // the reason why the check point is before the req is because of the req's async nature. an error may occur before the promise has resolved
    // and the postgresFile variable will not hold the necessary info for delete even though the file ended up being successfully deleted
    postgresFile = { userId: userId, name: name }
    const pdf = await prisma.document.create({
      data: {
        userId: userId,
        name: name,
      },
    });

    // then save the preview to the table
    postgresPreview = pdf.id;
    const prev = await prisma.preview.create({
      data: {
        documentId: pdf.id,
      },
    });

    // then upload the document to s3
    awsFile = filename;
    const putFileCommand = new PutObjectCommand({
      Bucket: "docuquery-files",
      Key: filename,
      Body: fileBuffer,
      ContentType: file.type,
    });
    await s3client.send(putFileCommand);

    // finally we can upload the image buffer to s3
    const previewName = `user-${userId}/previews/${formData.get("name")}`;
    awsPreview = previewName;
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

    // if one upload fails, any of the successful uploads now need to be deleted. we can use these checkpoint variables that indicate which uploads happened and which did not
    // and the id/key of each upload to delete as well
    // also due to the one to one relationship between preview and document, and the preview holding the 
    // foreign key, preview cannot exist without a document to link to, so we must always delete the preview first and then
    // the document
    if (postgresPreview) {
      await prisma.preview.delete({
        where: {
          documentId: postgresPreview,
        }
      });
    }
    if (postgresFile) {
      await prisma.document.delete({
        where: {
          userId: postgresFile.userId,
          name: postgresFile.name,
        }
      });
    }
    if (awsFile) {
      const deleteAwsCommand = new DeleteObjectCommand({
        Bucket: "docuquery-files",
        Key: awsFile,
      });
      await s3client.send(deleteAwsCommand);
    }
    if (awsPreview) {
      const deleteAwsCommand = new DeleteObjectCommand({
        Bucket: "docuquery-files",
        Key: awsPreview,
      });
      await s3client.send(deleteAwsCommand);
    }

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
