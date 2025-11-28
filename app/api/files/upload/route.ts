import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { s3client } from "@/utils/s3/client";
import { getPdfPreview } from "@/utils/pdf-to-image";
import { prisma } from "@/prisma/client";
import { pc } from "@/utils/pinecone/client";
import { getPdfText } from "@/utils/pdf-to-text";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { presignedUrlClient } from "@/utils/s3/client";

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

    // handle all checks before the rate limiting so that we do not incorrectly update the users' rate counts when the file never actually uploaded.
    // harvest the formdata. expect file and name
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;
    // currently only support pdfs
    if (file.type != "application/pdf") return NextResponse.json({ error: "We currently only support PDF file uploads. Please upload a PDF file instead." }, { status: 415 });
    // enforce max size of 5 mb for a file
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "File size must not exceed 5 MB." }, { status: 429 });
    // check if the user has already uploaded a file with that name
    const exists = await prisma.document.findFirst({
      where: {
        userId: userId,
        name: name,
      },
    });
    if (exists) return NextResponse.json({ error: "Please choose a unique file name, you already have one under that name." }, { status: 409 });

    // first step of rate limiting, enforce max of 5 uploaded files at once
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
      include: {
        documents: true,
      },
    });
    if (user && user.documents.length >= 5) return NextResponse.json({ error: "You’ve reached the free-tier limit of 5 uploaded files. Please remove a file before uploading another. You can find more details about rate limits on our Terms & Conditions page." }, {
      status: 429
    });

    // here is where we strictly check the rate limits for the user and decline service if needed. on success, at the end of the block we will then update the rate limit, that we we are not counting failed requests into the limit counts
    // first try to get the users' rate limit record
    let rateLimit = await prisma.rateLimit.findUnique({
      where: {
        userId: userId
      }
    });
    // if it does not exist, just create one then move on (they havent reached any daily limit yet)
    if (!rateLimit) {
      rateLimit = await prisma.rateLimit.create({
        data: {
          userId: userId,
        }
      });
    } else {
      // if it does exist, just check that they have not hit the daily limit for file uploads (2). if they have reject service, else move on
      // to do this we first need to make sure the record is not expired, which in that case we will not reject service, we will just create a new record for them an move on
      // check if expired. compare the utc timestamp of the record with current date constructed using millseconds in utc, then subtracted 1 day in millseconds from, and instantiated to a new date that can be compared with the utc string from the record
      const expired = rateLimit.date <= new Date(Date.now() - 24 * 60 * 60 * 1000);
      if (expired) {
        await prisma.rateLimit.delete({
          where: {
            userId: userId
          }
        });
        await prisma.rateLimit.create({
          data: {
            userId: userId,
          }
        });
      } else if (rateLimit.file_uploads >= 2) {
        // case that it has not expired AND they have hit the limit, in which case we have to reject service
        const refreshesAt = rateLimit.date;
        refreshesAt.setDate(refreshesAt.getDate() + 1); // append 1 day to the date (when the limit will refresh)
        const diffMs = refreshesAt.getTime() - Date.now();
        const totalMinutes = Math.max(0, Math.ceil(diffMs / (1000 * 60)));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return NextResponse.json({ error: `You’ve reached the free-tier daily upload limit of 2 files. Your limit will refresh in ${hours} hours and ${minutes} minutes.` }, { status: 429 });
      }
    }
    // end of rate limiting check block

    const filename = `user-${userId}/docs/${name}.pdf`;
    // convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

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
    const previewName = `user-${userId}/previews/${formData.get("name")}.png`;
    const putPreviewCommand = new PutObjectCommand({
      Bucket: "docuquery-files",
      Key: previewName,
      Body: previewBuffer,
      ContentType: "image/png",
    });
    await s3client.send(putPreviewCommand);
    awsPreview = previewName;

    const getPreviewCommand = new GetObjectCommand({
      Bucket: "docuquery-files",
      Key: previewName,
    });
    const url = await getSignedUrl(presignedUrlClient, getPreviewCommand, { expiresIn: 3600 }); // 60 minutes
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 59); // take off a minute to be safe, it might take time for these lines of code to run

    // then save the preview to the table
    const prev = await prisma.preview.create({
      data: {
        documentId: pdf.id,
        presignedUrl: url,
        expiry: expiry,
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

    // lastly, we can now update the user's rate limit record to reflect the successful upload 
    await prisma.rateLimit.update({
      where: {
        userId: userId
      },
      data: {
        file_uploads: rateLimit.file_uploads + 1 // just add one to what the record from earlier held
      }
    });

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
