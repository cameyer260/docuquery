import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3client } from "@/s3/client";

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
    let name = formData.get("name");
    name = `user-${userId}/` + name;

    // convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // first check if the user has already uploaded a file with that name
    const readCommand = new ListObjectsV2Command({
      Bucket: "docuquery-files",
      Prefix: `user-${userId}/`,
    });
    const res = await s3client.send(readCommand);
    const files = res.Contents?.map((obj) => obj.Key) || [];
    for (const file of files) {
      if (file == name) return NextResponse.json({ error: "Please choose a unique file name, you already have one under that name." }, { status: 409 });
    }

    // TODO add rate limiting here

    // otherwise all tests passed, upload the file to s3
    const putCommand = new PutObjectCommand({
      Bucket: "docuquery-files",
      Key: name,
      Body: buffer,
      ContentType: file.type,
    });
    await s3client.send(putCommand);

    return NextResponse.json({ payload: "Successfully uploaded the file." }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
