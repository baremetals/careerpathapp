import { Request, Response, NextFunction } from 'express';
// import { EmailService } from '../services/EmailService';
// import catchAsync from '../utils/catchAsync';

export const rootHandler = async (
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // const url = `${req.protocol}://${req.get('host')}/activate/`;
  // await new EmailService(
  //   {
  //     email: 'petaviv728@lukaat.com',
  //     firstName: 'Petaviv',
  //   },
  //   url,
  // ).sendWelcomeEmail();
  res
    .status(200)
    .json({ message: 'Welcome to the Career Path Recommendation App!' });
};
