import { NextFunction, Request, Response } from 'express';
// import { Document, Model } from 'mongoose';
import { ERROR_MESSAGES } from '../lib/error-messages';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import { IRepository } from '@/repository/IRepository';
import { HTTP_STATUS_CODES } from '@/lib/status-codes';
import { FactoryRepo } from '@/repository/FactoryRepo';

// export default function deleteOne<T extends Document>(Model: Model<T>) {
//   return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const doc = await Model.findByIdAndDelete(req.params.id);

//     if (!doc) {
//       return next(new AppError(ERROR_MESSAGES.FACTORY.DOC_NOT_FOUND, 404));
//     }
//     res.status(204).end();
//   });
// }

export default function deleteOne<T>(Model: IRepository<T>) {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const factoryRepo = new FactoryRepo();
    const doc = await factoryRepo.deleteOne(Model, req.params.id);

    if (!doc) {
      return next(
        new AppError(
          ERROR_MESSAGES.FACTORY.DOC_NOT_FOUND,
          HTTP_STATUS_CODES.NOT_FOUND,
        ),
      );
    }
    res.status(HTTP_STATUS_CODES.NO_CONTENT).end();
  });
}
