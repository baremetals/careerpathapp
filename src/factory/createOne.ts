import { FactoryRepo } from '@/repository/FactoryRepo';
// import AppError from '@/utils/appError';
import catchAsync from '@/utils/catchAsync';
import { Request, Response } from 'express';
// import { Document, Model } from 'mongoose';
import { IRepository } from '@/repository/IRepository';
import { HTTP_STATUS_CODES } from '@/lib/status-codes';

// export default function createOne<T extends Document>(Model: Model<T>) {
//   return catchAsync(async (req: Request, res: Response) => {
//     try {
//       const doc = await Model.create(req.body);

//       res.status(201).json({
//         data: doc,
//       });
//     } catch (error: any) {
//       console.log(error);
//       throw new AppError(error.message, 400);
//     }
//   });
// }

export default function createOne<T>(Model: IRepository<T>) {
  return catchAsync(async (req: Request, res: Response) => {
    const factoryRepo = new FactoryRepo();
    const doc = await factoryRepo.createOne(Model, req.body);
    res.status(HTTP_STATUS_CODES.CREATED).json({
      data: doc,
    });
  });
}
