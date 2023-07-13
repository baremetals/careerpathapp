import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';

export const activationPageHandler = catchAsync(
  async (_eq: Request, res: Response, _next: NextFunction) => {
    res.render('activate');
  },
);

export const resetPasswordPageHandler = catchAsync(
  async (_eq: Request, res: Response, _next: NextFunction) => {
    res.render('reset_password');
  },
);
