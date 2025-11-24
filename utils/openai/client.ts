import OpenAI from "openai";
export const gpt = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
