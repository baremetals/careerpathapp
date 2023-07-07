import { Request, Response, NextFunction } from 'express';
// import catchAsync from '../utils/catchAsync';

export const rootHandler = (
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  res
    .status(200)
    .json({ message: 'Welcome to the Career Path Recommendation App!' });
};
