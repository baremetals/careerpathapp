import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';
import { updateUserProfile } from '../../services/UserService';

const createResponses = (Model: Model<any>) =>
  catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    // const docs = req.body;
    const {
      responses,
      // selectedInterests,
      // selectedIndustries
    } = req.body;
    const body = {
      selectedIndustries: req.body.selectedIndustries,
      selectedInterests: req.body.selectedInterests,
    };
    await updateUserProfile(body, req.body.objectId, next);

    if (responses.length < 1) {
      return next(new AppError('No data to store', 401));
    }
    await Model.insertMany(responses);

    next();
  });

const updateResponses = (Model: Model<any>) =>
  catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    // const docs = req.body;
    const {
      responses,
      // selectedInterests,
      // selectedIndustries
    } = req.body;
    const body = {
      selectedIndustries: req.body.selectedIndustries,
      selectedInterests: req.body.selectedInterests,
    };
    await updateUserProfile(body, req.body.objectId, next);

    if (responses.length < 1) {
      return next(new AppError('No data to store', 401));
    }

    responses.forEach(async (doc: { objectId: string; }) => {
      const query = Model.findByIdAndUpdate(
        doc.objectId,
        { ...req.body, lastModifiedAt: Date.now() },
        {
          new: true,
          runValidators: true,
        },
      );
      await query.exec();
    });

    next();
  });


export { createResponses, updateResponses };
