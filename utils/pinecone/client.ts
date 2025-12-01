import { Pinecone } from '@pinecone-database/pinecone';

let client: Pinecone | null = null;

export const getPineconeClient = (): Pinecone => {
  if (client) return client;

  if (!process.env.PINECONE_API_KEY) {
    throw new Error("Missing Pinecone API_KEY.");
  }
  client = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY as string,
  });

  return client;
}
