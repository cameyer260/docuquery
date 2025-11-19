import { prisma } from "@/prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import type { ClientDocument } from "@/types/client-side-types";

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

    // get the user's files metadata from postgres first
    const files = await prisma.document.findMany({
      where: {
        userId: userId,
      },
      include: {
        preview: true,
      }
    });

    // TODO update presigned urls if needed
    // loop through files and get new presigned urls for previews that have expired
    // TODO DEBUG PRESIGNED URL NOT WORKING

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
