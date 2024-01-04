import { HTTP_STATUS_CODES } from '@/lib/status-codes';
import { FactoryRepo } from '@/repository/FactoryRepo';
import { NextFunction, Request, Response } from 'express';
import { ERROR_MESSAGES } from '../lib/error-messages';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import { IRepository } from '@/repository/IRepository';

export default function createMany<T>(Model: IRepository<T>) {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const docs: T[] = req.body;
    const factoryRepo = new FactoryRepo();
    if (!Array.isArray(docs) || docs.length < 1) {
      return next(
        new AppError(
          ERROR_MESSAGES.FACTORY.NO_DOCUMENTS,
          HTTP_STATUS_CODES.BAD_REQUEST,
        ),
      );
    }
    try {
      const createdDocs = await factoryRepo.createMany(Model, docs);
      res.status(HTTP_STATUS_CODES.CREATED).json({
        message: 'Created all entities successfully',
        count: createdDocs.length,
      });
    } catch (error) {
      next(error);
    }
  });
}
