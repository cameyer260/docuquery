import { S3Client } from "@aws-sdk/client-s3";

let s3client: S3Client | null = null;
let presignedUrlClient: S3Client | null = null;

export const getS3Client = (): S3Client => {
  if (s3client) return s3client;

  if (!process.env.S3_ACCESS_KEY || !process.env.S3_SECRET_KEY) {
    throw new Error("Missing Pinecone API_KEY.");
  }

  s3client = new S3Client({
    region: "us-east-2",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY as string,
      secretAccessKey: process.env.S3_SECRET_KEY as string,
    }
  });

  return s3client;
}

export const getPresignedUrlClient = (): S3Client => {
  if (presignedUrlClient) return presignedUrlClient;

  if (!process.env.S3_ACCESS_KEY || !process.env.S3_SECRET_KEY) {
    throw new Error("Missing Pinecone API_KEY.");
  }

  presignedUrlClient = new S3Client({
    region: "us-east-2",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY as string,
      secretAccessKey: process.env.S3_SECRET_KEY as string,
    },
    // DISABLE all defaults that add upload-specific headers
    forcePathStyle: false,
  });

  return presignedUrlClient;
}
