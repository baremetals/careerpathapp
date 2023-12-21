import { Request, Response } from 'express';
// import { Document, Model } from 'mongoose';
import { HTTP_STATUS_CODES } from '@/lib/status-codes';
import catchAsync from '../utils/catchAsync';
import { FactoryRepo } from '@/repository/FactoryRepo';
import { IRepository } from '@/repository/IRepository';

// export default function getMany<T extends Document>(
//   Model: Model<T>,
//   filter: object = {},
// ) {
//   return catchAsync(async (req: Request, res: Response) => {
//     // EXECUTE QUERY
//     const features = new APIQueryFeatures(Model.find(filter), req.query)
//       .filter()
//       .sort()
//       .limitFields()
//       .paginate();
//     const doc = await features.query.exec();

//     res.status(200).json({
//       count: doc.length,
//       data: doc,
//     });
//   });
// }

export default function getMany<T>(Model: IRepository<T>, filter: object = {}) {
  return catchAsync(async (req: Request, res: Response) => {
    const factoryRepo = new FactoryRepo();
    const docs = await factoryRepo.getMany(Model, filter, req.query);
    res.status(HTTP_STATUS_CODES.OK).json({
      count: docs.length,
      data: docs,
    });
  });
}
