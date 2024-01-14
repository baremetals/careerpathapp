import AppError from '@/utils/appError';
import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
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

const sqsClient = new SQSClient({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
}); // replace REGION with your AWS region

async function sendMessageToQueue(queueUrl: string, messageBody: string) {
  console.log(
    'AWS_SECRET_ACCESS_KEY exists:',
    !!process.env.AWS_SECRET_ACCESS_KEY,
  );
  console.log(
    'AWS_SECRET_ACCESS_KEY length:',
    process.env.AWS_SECRET_ACCESS_KEY?.length,
  );
  const params = {
    QueueUrl: queueUrl,
    MessageBody: messageBody,
  };

  const command = new SendMessageCommand(params);

  try {
    const data = await sqsClient.send(command);
    console.log('Success, message sent. Message ID: ', data.MessageId);
  } catch (error) {
    console.error('Error, message not sent: ', error);
    throw new AppError('Error, message not sent', 500);
  }
}

export { bucketName, s3Instance, sendMessageToQueue };
