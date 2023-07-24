import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';

const adminMiddleWare = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    // roles ['admin', '']. role='user'
    if (!roles.includes(req.session.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }

    next();
  };
};

export default adminMiddleWare;
