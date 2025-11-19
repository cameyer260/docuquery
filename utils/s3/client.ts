import { S3Client } from "@aws-sdk/client-s3";

export const s3client = new S3Client({
  region: "us-east-2",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_SECRET_KEY as string,
  }
});

export const presignedUrlClient = new S3Client({
  region: "us-east-2",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_SECRET_KEY as string,
  },
  // DISABLE all defaults that add upload-specific headers
  forcePathStyle: false,
});
