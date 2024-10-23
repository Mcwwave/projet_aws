import { S3Client } from "@aws-sdk/client-s3";

import dotenv from 'dotenv';

dotenv.config();

export const s3Client = new S3Client({
    region: process.env.region,
    credentials: {
      accessKeyId: process.env.accessKeyId,
      secretAccessKey: process.env.secretAccessKey,
    },
  });