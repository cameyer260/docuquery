import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3client } from "@/s3/client";
import { fromBuffer } from "pdf2pic";
import { readFile } from "fs/promises";

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

    // harvest the formdata. expect file and name
    const formData = await req.formData();
    const file = formData.get("file") as File;
    // currently only support pdfs
    if (file.type != "application/pdf") return NextResponse.json({ error: "We currently only support PDF file uploads. Please upload a PDF file instead." }, { status: 415 });
    const filename = `user-${userId}/${formData.get("name")}`;

    // convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // first check if the user has already uploaded a file with that name
    const readCommand = new ListObjectsV2Command({
      Bucket: "docuquery-files",
      Prefix: `user-${userId}/`,
    });
    const res = await s3client.send(readCommand);
    const files = res.Contents?.map((obj) => obj.Key) || [];
    for (const file of files) {
      if (file == filename) return NextResponse.json({ error: "Please choose a unique file name, you already have one under that name." }, { status: 409 });
    }

    // TODO add rate limiting here

    // otherwise all tests passed, upload the file to s3
    const putFileCommand = new PutObjectCommand({
      Bucket: "docuquery-files",
      Key: filename,
      Body: fileBuffer,
      ContentType: file.type,
    });
    await s3client.send(putFileCommand);

    // create image preview upload it
    // first, use pdf2pic (literally the only library I could find that actually is able to convert a pdf to picture)
    // downside is it saves it to a path instead of returning a file buffer and staying in memory
    // this means we have to store the file temporarily in a folder (rootdirectory/previews) where we can then load it back 
    // into memory, store it in s3, and delete it from the folder on success or error
    const options = {
      saveFilename: userId,
      savePath: "./previews/",
      width: 120,
      height: 120,
    };
    const convert = fromBuffer(fileBuffer, options);
    await convert(1, { responseType: "image" });

    // now we load it back into memory as a buffer and send it to s3
    const previewPath = `./previews/${userId}`;
    const previewBuffer = await readFile(previewPath);
    // TODO PICKUP HERE. LOAD FILE BACK INTO MEMORY AS BUFFER, UPLOAD TO S3, THEN DELETE FROM MEMORY REGARDLESS OF ERROR OR NOT

    // now upload it to pinecone, embed it there and then upload in vector db as well


    return NextResponse.json({ payload: "Successfully uploaded the file." }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
