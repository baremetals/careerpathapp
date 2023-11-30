import { Request, Response } from 'express';
import { Document, Model } from 'mongoose';
import APIQueryFeatures from '../utils/apiQueryFeatures';
import catchAsync from '../utils/catchAsync';

export default function getMany<T extends Document>(
  Model: Model<T>,
  filter: object = {},
) {
  return catchAsync(async (req: Request, res: Response) => {
    // EXECUTE QUERY
    const features = new APIQueryFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query.exec();

    res.status(200).json({
      count: doc.length,
      data: doc,
    });
  });
}
