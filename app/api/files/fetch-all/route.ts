import { prisma } from "@/prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import type { ClientDocument } from "@/types/client-side-types";
import { getPresignedUrlClient } from "@/utils/s3/client";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function GET() {
  try {
    // handle auth up top
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json(
        { error: "User is not authorized to make the request." },
        { status: 401 },
      );
    const userId = session?.user?.id;
    const presignedUrlClient = getPresignedUrlClient();

    // get the user's files metadata from postgres first
    let files = await prisma.document.findMany({
      where: {
        userId: userId,
      },
      include: {
        preview: true,
      }
    });

    // loop through files and get new presigned urls for previews that have expired
    files = await Promise.all(files.map(async (value) => {
      if (value.preview?.expiry && value.preview.expiry < new Date(new Date().toUTCString())) {
        const getPreviewCommand = new GetObjectCommand({
          Bucket: "docuquery-files",
          Key: `user-${userId}/previews/${value.name}.png`,
        });
        const url = await getSignedUrl(presignedUrlClient, getPreviewCommand, { expiresIn: 3600 }); // 60 minutes
        const expiry = new Date();
        expiry.setMinutes(expiry.getMinutes() + 59); // take off a minute to be safe, it might take time for these lines of code to run

        // then update the preview in postgres
        await prisma.preview.update({
          where: {
            id: value.preview.id
          },
          data: {
            presignedUrl: url,
            expiry: expiry,
          },
        });

        // then update the data we are returning
        value.preview.expiry = expiry;
        value.preview.presignedUrl = url;
      }
      return value;
    }))

    // clean the query result and send only the necessary data back
    const data: ClientDocument[] = files.map((item) => {
      return {
        id: item.id,
        imgUrl: item.preview?.presignedUrl as string,
        title: item.name,
      }
    });

    return NextResponse.json({ payload: data }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
