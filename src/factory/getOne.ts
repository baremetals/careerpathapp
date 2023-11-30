import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import { ERROR_MESSAGES } from '../lib/error-messages';

export default function getOne(
  Model: Model<any>,
  options: {
    notFoundMessage: string;
    populateOptions?: string | Array<string>;
    idParam: string;
  } = {
    idParam: 'id',
    notFoundMessage: ERROR_MESSAGES.FACTORY.DOC_NOT_FOUND,
  },
) {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let query = Model.findById(req.params[options.idParam]);

    if (options.populateOptions) {
      query = Array.isArray(options.populateOptions)
        ? query.populate(options.populateOptions.join(' '))
        : query.populate(options.populateOptions);
    }

    const doc = await query.exec();
    if (!doc) {
      return next(new AppError(options.notFoundMessage, 404));
    }

    res.status(200).json({
      data: doc,
    });
  });
}

// const getOne = (
//   Model: Model<object>,
//   options: {
//     notFoundMessage: string;
//     populateOptions?: string | Array<string>;
//     idParam: string;
//   } = {
//     idParam: 'id',
//     notFoundMessage: 'No document found with that ID',
//   },
// ) =>
//   catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     let query = Model.findById(req.params[options.idParam]);

//     if (options.populateOptions) {
//       query = Array.isArray(options.populateOptions)
//         ? query.populate(options.populateOptions.join(' '))
//         : query.populate(options.populateOptions);
//     }

//     const doc = await query.exec();
//     if (!doc) {
//       return next(new AppError(options.notFoundMessage, 404));
//     }

//     res.status(200).json({
//       data: doc,
//     });
//   });
