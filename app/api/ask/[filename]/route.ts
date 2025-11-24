import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/prisma/client";
import { pc } from "@/utils/pinecone/client";

export async function GET(req: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  try {
    const { filename } = await params;
    // handle auth up top
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json(
        { error: "User is not authorized to make the request." },
        { status: 401 },
      );
    const userId = session?.user?.id;

    // TODO add rate limiting here.

    // first, we fetch the document they want to chat with
    const document = await prisma.document.findUnique({
      where: {
        userId: userId,
        name: filename,
      }
    });
    if (!document) return NextResponse.json({ error: `User does not own a document of name: ${filename}` }, { status: 404 });

    // then we fetch the chat log for that document
    // if one has not been created just create one, else return the existing log with the messages attatched to it

    // then we add the chat log to payload here and send back to the user
    return NextResponse.json({ payload: "Add the chat log data here." }, { status: 200 });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  try {
    const { filename } = await params;
    const body = await req.json();
    const prompt = body.prompt;
    // handle auth up top
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json(
        { error: "User is not authorized to make the request." },
        { status: 401 },
      );
    const userId = session?.user?.id;

    // TODO add rate limiting here.

    // first, we fetch the document they want to chat with
    const document = await prisma.document.findUnique({
      where: {
        userId: userId,
        name: filename,
      }
    });
    if (!document) return NextResponse.json({ error: `User does not own a document of name: ${filename}` }, { status: 404 });

    // then we send their message to the pinecone api for similarity search
    const namespace = pc.index("docuquery", "https://docuquery-38emsw1.svc.aped-4627-b74a.pinecone.io").namespace(userId);
    const response = await namespace.searchRecords({
      query: {
        topK: 3,
        inputs: { text: prompt },
        filter: { pdf_id: document.id }
      }
    });
    console.log(response);

    // then we send their prompt in text with instructions and the top k results to the gpt api 

    // then we take that response and send it back to the user in the payload
    return NextResponse.json({ payload: "Add the response here" }, { status: 200 });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
