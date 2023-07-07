import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import os from 'os';
// import path from 'path';
// import fs from 'fs';
// const filepath = path.join(os.tmpdir(), path.basename('uploadFileName'));
import multer from 'multer';
import { bucketName, s3Instance } from './aws-config';

const multerStorage = multer.memoryStorage();

const multerUpload = multer({
  storage: multerStorage,
});

async function uploadFile(
  originalname: string,
  body: Buffer,
  mimetype: string,
) {
  const contentExtension =
    originalname.split('.')[originalname.split('.').length - 1];
  const fileName = `${Math.round(
    Math.random() * 1000000000000,
  ).toString()}.${contentExtension}`;

  const uploadParams = {
    Bucket: bucketName,
    Body: body,
    Key: fileName,
    ContentType: mimetype,
    ContentDisposition: 'inline',
    Acl: 'public-read',
  };
  const command = new PutObjectCommand(uploadParams);
  await s3Instance.send(command);
  return fileName;
}

async function getSignedFileUrl(fileName: string, expiresIn: number) {
  // Instantiate the GetObject command,
  // a.k.a. specific the bucket and key
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileName,
  });

  // await the signed URL and return it
  return await getSignedUrl(s3Instance, command, { expiresIn });
}

async function deleteFile(fileName: string) {
  const bucketParams = { Bucket: bucketName, Key: fileName };
  const command = new DeleteObjectCommand(bucketParams);
  return s3Instance.send(command);
}

export { multerUpload, uploadFile, getSignedFileUrl, deleteFile };
