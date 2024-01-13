import { IUserDocument, SanitizedUser } from '@/interfaces/user';
import { ERROR_MESSAGES } from '@/lib/error-messages';
import { HTTP_STATUS_CODES } from '@/lib/status-codes';
import { UserRepo } from '@/repository/UserRepo';
import AppError from '@/utils/appError';
import catchAsync from '@/utils/catchAsync';
import { NextFunction, Request, Response } from 'express';

export default catchAsync(async function getUserHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userRepo = new UserRepo();

  const user: IUserDocument = (await userRepo.findById(
    req.params.id,
  )) as IUserDocument;
  console.log('user', user);
  if (!user) {
    return next(
      new AppError(
        ERROR_MESSAGES.AUTH.NO_USER_EXISTS,
        HTTP_STATUS_CODES.NOT_FOUND,
      ),
    );
  }
  res.status(HTTP_STATUS_CODES.OK).json({
    data: { user: new SanitizedUser(user) },
  });
});
