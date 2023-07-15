import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';

export const activationPageHandler = catchAsync(
  async (_eq: Request, res: Response) => {
    console.log('I was here darg ======>');
    res.render('activate');
  },
);

export const resetPasswordPageHandler = catchAsync(
  async (_eq: Request, res: Response) => {
    res.render('reset_password');
  },
);
