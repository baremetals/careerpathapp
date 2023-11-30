import { NextFunction, Request, Response } from 'express';
import { Document, Model } from 'mongoose';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import { ERROR_MESSAGES } from '../lib/error-messages';

export default function createMany<T extends Document>(Model: Model<T>) {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const docs: [] = req.body;
    if (!Array.isArray(docs) || docs.length < 1) {
      return next(new AppError(ERROR_MESSAGES.FACTORY.NO_DOCUMENTS, 400));
    }
    try {
      const createdDocs = await Model.insertMany(docs);
      res.status(201).json({
        message: 'Created all entities successfully',
        count: createdDocs.length,
      });
    } catch (error) {
      next(error);
    }
  });
}
