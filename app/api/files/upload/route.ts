import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3client } from "@/utils/s3/client";
import { getPdfPreview } from "@/utils/pdf-to-image";
import { prisma } from "@/prisma/client";
import { pc } from "@/utils/pinecone/client";
import { getPdfText } from "@/utils/pdf-to-text";

export async function POST(req: NextRequest) {
  // bool variables to mark checkppoints in the upload process. used for error handling so I know where and what to delete if an upload fails
  let postgresFile: string | null = null;
  let postgresPreview: string | null = null;
  let awsFile: string | null = null;
  let awsPreview: string | null = null;
  let pinecone: { namespace: string, pdfId: string } | null = null;
  try {
    // handle auth up top
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json(
        { error: "User is not authorized to make the request." },
        { status: 401 },
      );
    const userId = session?.user?.id;

    // TODO add rate limiting here. limit the file size as well

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

    // all tests passed, first we'll convert the pdf to text
    const textBuffer = await getPdfText(fileBuffer);

    // then convert it to chunks array. chunk by 128 chars.
    const chunks: string[] = [];
    for (let i = 0; i < textBuffer.length; i += 128) {
      chunks.push(textBuffer.slice(i, i + 128));
    }

    // then we'll upload the file and preview to postgres then s3
    // first save the pdf to document table
    // then set the checkpoint variable accordingly so I know what to delete if later uploads fail
    const pdf = await prisma.document.create({
      data: {
        userId: userId,
        name: name,
      },
    });
    postgresFile = pdf.id;

    // then upload the document to s3
    const putFileCommand = new PutObjectCommand({
      Bucket: "docuquery-files",
      Key: filename,
      Body: fileBuffer,
      ContentType: file.type,
    });
    await s3client.send(putFileCommand);
    awsFile = filename;

    // now we can upload the image buffer to s3
    const previewName = `user-${userId}/previews/${formData.get("name")}`;
    const putPreviewCommand = new PutObjectCommand({
      Bucket: "docuquery-files",
      Key: previewName,
      Body: previewBuffer,
      ContentType: file.type,
    });
    await s3client.send(putPreviewCommand);
    awsPreview = previewName;

    // then save the preview to the table
    const prev = await prisma.preview.create({
      data: {
        documentId: pdf.id,
        // TODO add presigned url here
      },
    });
    postgresPreview = prev.id;

    // finally upload it to pinecone. pinecone will automatically handle embedding the text.
    const namespace = pc.index("docuquery", "https://docuquery-38emsw1.svc.aped-4627-b74a.pinecone.io").namespace(userId);
    const records = chunks.map((value, index) => ({
      "_id": `${pdf.id}#${index}`,
      "text": value,
      "pdf_id": pdf.id,
    }));
    await namespace.upsertRecords(records);
    pinecone = {
      namespace: userId,
      pdfId: pdf.id,
    };

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
          id: postgresPreview,
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
    if (postgresFile) {
      await prisma.document.delete({
        where: {
          id: postgresFile,
        }
      });
    }
    if (pinecone) {
      const namespace = pc.index("docuquery", "https://docuquery-38emsw1.svc.aped-4627-b74a.pinecone.io").namespace(pinecone.namespace);
      await namespace.deleteMany({
        pdf_id: { $eq: pinecone.pdfId }
      });
    }

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
