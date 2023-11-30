import { NextFunction, Request, Response } from 'express';
import { Document, Model } from 'mongoose';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import { ERROR_MESSAGES } from '../lib/error-messages';

export default function deleteOne<T extends Document>(Model: Model<T>) {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError(ERROR_MESSAGES.FACTORY.DOC_NOT_FOUND, 404));
    }
    res.status(204).end();
  });
}
