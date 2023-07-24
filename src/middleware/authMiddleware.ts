import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import { UserModel } from '../models/User';

const authMiddleWare = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // console.log('=======>', req.session.userId)

    if (!req.session.userId) {
      return next(
        new AppError(
          'You are not logged in! Please log in to get access.',
          401,
        ),
      );
    }

    // Check if user still exists
    const currentUser = await UserModel.findById(req.session.userId);
    if (!currentUser) {
      req.session?.destroy;
      res.clearCookie('connect.sid');
      return next(new AppError('The user not found.', 401));
    }
    // GRANT ACCESS TO PROTECTED ROUTE
    next();
  },
);
export default authMiddleWare;
