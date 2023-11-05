import { NextFunction, Request, Response } from 'express';
import {
  createPresignedUrlWithClient,
  createUniqueFileName,
} from '../../lib/fileUpload';
import AppError from '../../utils/appError';
// import catchAsync from '../../utils/catchAsync';

const requestPresignedUrlHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const fileName = createUniqueFileName(req.body);
    const signedUrl = await createPresignedUrlWithClient(fileName);

    res.status(201).json({
      status: 'success',
      message: 'Your url has is only valid for 1 hour',
      data: signedUrl,
    });
  } catch (error) {
    console.log('=============><==============', error);
    return next(
      new AppError('unable to upload right now please try again later', 400),
    );
  }
};

export { requestPresignedUrlHandler };
