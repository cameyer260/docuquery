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

    // check that their prompt does not exceed the limit of 175 chars
    if (prompt.length > 175) return NextResponse.json({ error: "Prompt exceeds max length of 175 characters. Please trim down the prompt and try again." }, { status: 413 });

    // first, we fetch the document they want to chat with
    const document = await prisma.document.findUnique({
      where: {
        userId: userId,
        name: filename,
      }
    });
    if (!document) return NextResponse.json({ error: `User does not own a document of name: ${filename}` }, { status: 404 });

    // now we can check if they have hit the daily rate limit and refuse service if so
    // first try to get the rate limit record
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
      // if it does exist, just check that they have not hit the daily limit for promts (15). if they have reject service, else move on
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
      } else if (rateLimit.prompt_uploads >= 15) {
        // case that it has not expired AND they have hit the limit, in which case we have to reject service
        const refreshesAt = rateLimit.date;
        refreshesAt.setDate(refreshesAt.getDate() + 1); // append 1 day to the date (when the limit will refresh)
        const diffMs = refreshesAt.getTime() - Date.now();
        const totalMinutes = Math.max(0, Math.ceil(diffMs / (1000 * 60)));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return NextResponse.json({ error: `You’ve reached the free-tier daily prompt limit of 15 prompts. Your limit will refresh in ${hours} hours and ${minutes} minutes.` }, { status: 429 });
      }
    }
    // end of rate limiting check block

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
      },
    });
    // before we move on, check that the log has not reached a length of 100. if it has the user will need to move on to a new log, either deleting this one and creating a new one or just creating a new one
    const messageCount = await prisma.message.count({
      where: {
        logId: log.id
      }
    });
    if (messageCount > 100) return NextResponse.json({ error: "You have reached the max size of a conversation of 100 messages. Please move on to another log to continue." }, { status: 429 });
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

    // on success we can update their rate limit here as well
    await prisma.rateLimit.update({
      where: {
        userId: userId
      },
      data: {
        prompt_uploads: rateLimit.prompt_uploads + 1 // just add one to what the record from earlier held
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
