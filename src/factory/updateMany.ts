import { NextFunction, Request, Response } from 'express';
import { Document, Model } from 'mongoose';
import { ERROR_MESSAGES } from '../lib/error-messages';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';

export default function updateMany<T extends Document>(Model: Model<any>) {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updates: Array<T> = req.body.update;
      // console.log('i went of ========================>', updates[0]);

      if (updates.length === 0) {
        return next(
          new AppError(ERROR_MESSAGES.FACTORY.REQUIRED_FILTER_OR_UPDATE, 400),
        );
      }

      // Update each document individually
      for (const updateData of updates) {
        const { _id, ...updateFields } = updateData;
        await Model.updateOne({ _id }, { $set: updateFields });
      }

      res.status(200).json({
        message: 'Updated successfully',
      });
    } catch (error) {
      console.log(error);
    }
  });
}
