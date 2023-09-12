import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';

const getOne = (Model: Model<any>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = Model.findById(req.params.id);
    const doc = await query.exec();
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

const getMany = (Model: Model<any>) =>
  catchAsync(async (_req: Request, res: Response, _next: NextFunction) => {
    // To allow for nested GET reviews on tour (hack)
    // let filter = {};
    // if (req.params.tourId) filter = { tour: req.params.tourId };

    const response = await Model.find();

    // const features = new APIFeatures(Model.find(filter), req.query)
    //   .filter()
    //   .sort()
    //   .limitFields()
    //   .paginate();
    // const doc = await features.query.explain();
    // const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      // results: doc.length,
      data: response,
    });
  });

const createOne = (Model: Model<any>) =>
  catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

const createMany = (Model: Model<any>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const docs = req.body;
    if (docs.length < 1) {
      return next(new AppError('No data to store', 401));
    }
    await Model.insertMany(docs);

    res.status(201).json({
      status: 'success',
    });
  });

const updateOne = (Model: Model<any>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = Model.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastModifiedAt: Date.now() },
      {
        new: true,
        runValidators: true,
      },
    );

    const doc = await query.exec();

    if (!doc) {
      return next(new AppError('No document found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

const deleteOne = (Model: Model<any>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
export { createMany, createOne, deleteOne, getMany, getOne, updateOne };
