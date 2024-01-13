import { NextFunction, Request, Response } from 'express';
// import { Document, Model } from 'mongoose'
import { ERROR_MESSAGES } from '../lib/error-messages';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import { IRepository } from '@/repository/IRepository';
import { HTTP_STATUS_CODES } from '@/lib/status-codes';
import { FactoryRepo } from '@/repository/FactoryRepo';

// export default function updateOne<T extends Document>(Model: Model<T>) {
//   return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const updateData = { ...req.body };
//     // console.log('=======================THE DATA', updateData);
//     const doc = await Model.findByIdAndUpdate(req.params.id, updateData, {
//       new: true,
//       runValidators: true,
//     }).exec();

//     if (!doc) {
//       return next(new AppError(ERROR_MESSAGES.FACTORY.DOC_NOT_FOUND, 404))
//     }

//     res.status(200).json({
//       message: 'Updated successfully',
//     });
//   });
// }

export default function updateOne<T>(Model: IRepository<T>) {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const factoryRepo = new FactoryRepo();
    // console.log('=======================THE DATA', updateData)
    const doc = await factoryRepo.updateOne(Model, req.params.id, {
      ...req.body,
    });

    if (!doc) {
      return next(
        new AppError(
          ERROR_MESSAGES.FACTORY.DOC_NOT_FOUND,
          HTTP_STATUS_CODES.NOT_FOUND,
        ),
      );
    }

    res.status(HTTP_STATUS_CODES.OK).json({});
  });
}
