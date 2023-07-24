import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';

export const homePageHandler = catchAsync(
  async (_eq: Request, res: Response) => {
    res.render('index');
  },
);
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

export const loginPageHandler = catchAsync(
  async (_eq: Request, res: Response) => {
    res.render('login');
  },
);

export const registerPageHandler = catchAsync(
  async (_eq: Request, res: Response) => {
    res.render('register');
  },
);
