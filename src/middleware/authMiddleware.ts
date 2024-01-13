import { CookieNames } from '@/lib/constants';
import { ERROR_MESSAGES } from '@/lib/error-messages';
import { HTTP_STATUS_CODES } from '@/lib/status-codes';
import { UserRepo } from '@/repository/UserRepo';
import AppError from '@/utils/appError';
import catchAsync from '@/utils/catchAsync';
import { NextFunction, Request, Response } from 'express';

const authMiddleWare = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userRepo = new UserRepo();
    try {
      if (!req.session.userId) {
        console.log('no session found');
        return next(
          new AppError(
            ERROR_MESSAGES.AUTH.NOT_LOGGED_IN,
            HTTP_STATUS_CODES.UNAUTHORIZED,
          ),
        );
      }
      const currentUser = await userRepo.findById(req.session.userId);
      if (!currentUser) {
        req.session?.destroy((err: any) => {
          if (err) {
            console.log('destroy session failed I am zod');
            res
              .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
              .json({ message: 'Failed to destroy session' });
          }
        });
        res.clearCookie(CookieNames.ACCESS_TOKEN);
        return next(
          new AppError(
            ERROR_MESSAGES.AUTH.NO_USER_EXISTS,
            HTTP_STATUS_CODES.UNAUTHORIZED,
          ),
        );
      }
      next();
    } catch (err) {
      console.log('I AM PRINTING FROM HERE==========>', err);
      return next(
        new AppError(
          ERROR_MESSAGES.AUTH.NO_USER_EXISTS,
          HTTP_STATUS_CODES.UNAUTHORIZED,
        ),
      );
    }
  },
);
export default authMiddleWare;
