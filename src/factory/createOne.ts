import { Request, Response } from 'express';
import { Document, Model } from 'mongoose';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';

export default function createOne<T extends Document>(Model: Model<T>) {
  return catchAsync(async (req: Request, res: Response) => {
    try {
      const doc = await Model.create(req.body);

      res.status(201).json({
        data: doc,
      });
    } catch (error: any) {
      console.log(error);
      throw new AppError(error.message, 400);
    }
  });
}
