import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/prisma/client";
import { pc } from "@/utils/pinecone/client";
import { gpt } from "@/utils/openai/client";

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
    let log = await prisma.log.findUnique({
      where: {
        documentId: document.id,
      },
      include: {
        messages: true,
      }
    });
    // if one has not been created just create one, else return the existing log with the messages attatched to it
    if (!log) log = await prisma.log.create({
      data: {
        documentId: document.id
      },
      include: {
        messages: true,
      }
    });

    // then we add the chat log to payload here and send back to the user
    return NextResponse.json({ payload: log }, { status: 200 });

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
    if (!prompt) return NextResponse.json({ error: "POST request must include a prompt." }, { status: 400 });
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

    // then we save the prompt to the logs. first create the log if it does not already exist. just use upsert to do that
    const log = await prisma.log.upsert({
      where: {
        documentId: document.id
      },
      update: {
        documentId: document.id
      },
      create: {
        documentId: document.id
      }
    });
    // now we can add the new prompt to it
    await prisma.message.create({
      data: {
        logId: log.id,
        text: prompt,
        role: 'USER',
      }
    });

    // then we send their message to the pinecone api for similarity search
    const namespace = pc.index("docuquery", "https://docuquery-38emsw1.svc.aped-4627-b74a.pinecone.io").namespace(userId);
    const similarVectors = await namespace.searchRecords({
      query: {
        topK: 5,
        inputs: { text: prompt },
        filter: { pdf_id: document.id }
      }
    });

    // then we send their prompt in text with instructions and the top k results to the gpt api
    const contextArray = similarVectors.result.hits.map((value) => {
      // @ts-expect-error ts does not recognize pinecone hit type that is returned back
      return value.fields.text;
    });
    const contextString = contextArray.join();
    const response = await gpt.responses.create({
      model: 'gpt-5-mini-2025-08-07',
      instructions:
        `Answer the user's QUESTION using the following CONTEXT.
        Keep your answer grounded in the facts of the CONTEXT.
        If the CONTEXT does not contain the facts to answer the user's QUESTION, say so.
        CONTEXT:
        ${contextString}`,
      input: prompt,
    });
    const finalResponse = await prisma.message.create({
      data: {
        logId: log.id,
        text: response.output_text,
        role: 'AGENT',
      }
    });

    // then we send the user the response from the gpt along with the relevant vectors for citation info
    return NextResponse.json({ payload: { response: finalResponse, citation: similarVectors.result.hits } }, { status: 200 });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
