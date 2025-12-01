import OpenAI from "openai";

let client: OpenAI | null = null;

export const getGptClient = (): OpenAI => {
  if (client) return client;

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing Pinecone API_KEY.");
  }
  client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  return client;
}
