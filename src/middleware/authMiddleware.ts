import { NextFunction, Request, Response } from 'express';
import { CookieNames } from '../lib/constants';
import { ERROR_MESSAGES } from '../lib/error-messages';
import { UserModel } from '../models/User';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';

const authMiddleWare = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log('The mock has userId Here=======>', req.session.userId);
      console.log('THE HEADERS HERE=======>', req.headers);

      if (!req.session.userId) {
        return next(new AppError(ERROR_MESSAGES.AUTH.NOT_LOGGED_IN, 401));
      }
      const currentUser = await UserModel.findById(req.session.userId);
      if (!currentUser) {
        req.session?.destroy;
        res.clearCookie(CookieNames.ACCESS_TOKEN);
        return next(new AppError(ERROR_MESSAGES.AUTH.NO_USER_EXISTS, 401));
      }
      next();
    } catch (err) {
      console.log(err);
    }
  },
);
export default authMiddleWare;
