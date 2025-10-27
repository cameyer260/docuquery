import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json(
        { error: "User is not authorized to make the request." },
        { status: 401 },
      );

    const userId = session?.user?.id;

    const userWithAccounts = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: {
          select: {
            provider: true,
          },
        },
      },
    });

    if (!userWithAccounts)
      return NextResponse.json({ error: "User not found." }, { status: 404 });

    const connectedProviders = userWithAccounts.accounts.map(
      (account) => account.provider,
    );
    return NextResponse.json({ payload: connectedProviders }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
