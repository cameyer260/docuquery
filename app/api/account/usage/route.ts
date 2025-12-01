import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session)
      return NextResponse.json(
        { error: "User is not authorized to make the request." },
        { status: 401 },
      );

    const userId = session?.user?.id;

    const counts = {
      documentUploads: 0,
      prompts: 0,
      documentsUploaded: 0,
    };

    const rateLimit = await prisma.rateLimit.findUnique({
      where: {
        userId: userId
      }
    });

    // if the user has a rate limit record and it is not expired then update counts accordingly
    if (rateLimit && rateLimit.date > new Date(Date.now() - 24 * 60 * 60 * 1000)) {
      counts.documentUploads = rateLimit.file_uploads;
      counts.prompts = rateLimit.prompt_uploads;
    }

    // lastly get the amount of files they have uploaded currently
    const fileCount = await prisma.document.count({
      where: {
        userId: userId
      }
    });

    counts.documentsUploaded = fileCount;

    return NextResponse.json(
      { payload: counts },
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
