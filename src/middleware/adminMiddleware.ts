import { NextFunction, Request, Response } from 'express';
import AppError from '@/utils/appError';
import { HTTP_STATUS_CODES } from '@/lib/status-codes';
import { ERROR_MESSAGES } from '@/lib/error-messages';

const adminMiddleWare = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    // roles ['admin', '']. role='user'
    if (!roles.includes(req.session.role)) {
      return next(
        new AppError(
          ERROR_MESSAGES.AUTH.ADMIN_FORBIDDEN,
          HTTP_STATUS_CODES.FORBIDDEN,
        ),
      );
    }

    next();
  };
};

export default adminMiddleWare;
