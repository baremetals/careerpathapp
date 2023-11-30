import { NextFunction, Request, Response } from 'express';
import { Document, Model } from 'mongoose';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import { ERROR_MESSAGES } from '../lib/error-messages';

export default function deleteMany<T extends Document>(Model: Model<T>) {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { filter } = req.body;

    if (!filter) {
      return next(
        new AppError(ERROR_MESSAGES.FACTORY.REQUIRED_FILTER_OR_UPDATE, 400),
      );
    }

    const result = await Model.deleteMany(filter);

    res.status(200).json({
      message: 'Deleted successfully',
      deletedCount: result.deletedCount,
    });
  });
}
