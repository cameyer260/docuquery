import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { s3client } from "@/utils/s3/client";
import { DeleteObjectsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { pc } from "@/utils/pinecone/client";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session)
      return NextResponse.json(
        { error: "User is not authorized to make the request." },
        { status: 401 },
      );

    const userId = session?.user?.id;

    // before deleting their account, we need to delete all of their files and previews.
    // start with postgres (source of truth), then s3, then pinecone
    // first get all the documents the user owns so we know what to delete
    const docs = await prisma.document.findMany({
      where: {
        userId: userId,
      }
    });
    // delete each preview tied to each doc the user owns
    for (const doc of docs) {
      await prisma.preview.delete({
        where: {
          documentId: doc.id,
        }
      });
    }
    // then delete each document the user owns 
    await prisma.document.deleteMany({
      where: {
        userId: userId,
      }
    });
    // now we can run this loop to delete all files the user owns in s3. whenever we get a bad response we just break from the loop.
    while (true) {
      // now move on to s3, delete all the files and previews from there
      const listObjectsCommand = new ListObjectsV2Command({
        Bucket: "docuquery-files",
        Prefix: `user-${userId}/`
      });
      const listResponse = await s3client.send(listObjectsCommand);
      if (listResponse.Contents && listResponse.Contents.length > 0) {
        // if we still have objects returned, keep the loop going
        const targetObjs = listResponse.Contents.map(obj => ({ Key: obj.Key }));
        // delete the objects, max 1000 at a time (which is why we have to do this while loop in the first place)
        const deleteCommand = new DeleteObjectsCommand({
          Bucket: "docuquery-files",
          Delete: {
            Objects: targetObjs,
          }
        });
        await s3client.send(deleteCommand);
      } else break; // else break it
    }
    // after that we can delete the user's entire namespace from pinecone
    pc.index("docuquery", "https://docuquery-38emsw1.svc.aped-4627-b74a.pinecone.io").deleteNamespace(userId);

    // then we can finally delete the user's actual account
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return NextResponse.json(
      { payload: "Successfully delete the user's account." },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
