import { NextFunction, Request, Response } from 'express';
// import multer from 'multer';
import { ERROR_MESSAGES } from '../../lib/error-messages';
import {
  createPresignedUrlWithClient,
  // getSignedFileUrl,
  uploadFile,
} from '../../lib/fileUpload';
import AppError from '../../utils/appError';

export default async function updateAvatarHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log('========> upload', req.file);
  try {
    const file: Express.Multer.File = req.file as Express.Multer.File;
    if (!file.mimetype.startsWith('image')) {
      return next(new AppError(ERROR_MESSAGES.UPLOAD.NOT_AN_IMAGE, 400));
    }
    if (file.size > 1069736) {
      return next(new AppError(ERROR_MESSAGES.UPLOAD.LARGE_FILE_SIZE, 400));
    }
    const response = await uploadFile(
      file.originalname,
      file.buffer,
      file.mimetype,
    );
    // const fileUrl = await getSignedFileUrl(response, 3600)
    const presignedUrl = await createPresignedUrlWithClient(
      response,
      'image/jpeg',
    );
    console.log('================================>', presignedUrl);
    res.status(200).json({
      data: { url: presignedUrl },
    });
  } catch (err) {
    // TODO: handle error
    const errorMessage = ERROR_MESSAGES.UPLOAD.UPLOAD_FAILED;
    console.log('=============><==============', err);
    return next(new AppError(errorMessage, 400));
  }
}
