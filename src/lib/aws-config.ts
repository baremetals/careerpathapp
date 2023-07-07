import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();

const accessKeyId = process.env.AWS_ACCESS_KEY_ID as string;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY as string;
const region = process.env.AWS_REGION as string;
const bucketName = process.env.AWS_BUCKET_NAME as string;

const config: S3ClientConfig = {
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region,
};

const s3Instance = new S3Client(config);

export { bucketName, s3Instance };
