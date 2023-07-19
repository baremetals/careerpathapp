import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';

/**
 * Data validation middleware
 */
const questionResponseMiddleware = () =>
  catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    const { responses, selectedSkills, selectedIndustries } = req.body;
    if (selectedIndustries.length < 1) {
      return next(new AppError('Please provide at least one industry.', 400));
    }
    if (selectedSkills.length < 1) {
      return next(new AppError('Please provide at least one skill.', 400));
    }
    if (responses.length < 1 || responses.length < 20) {
      return next(
        new AppError('Please provide a response for all questions', 400),
      );
    }

    next();
  });

export default questionResponseMiddleware;
