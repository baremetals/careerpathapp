import * as argon2 from 'argon2';
import { NextFunction, Request, Response } from 'express';
import { IUserDocument, SanitizedUser } from '../../interfaces/user';
import { UserStatuses } from '../../lib/auth-validation-config';
import { ERROR_MESSAGES } from '../../lib/error-messages';
import { LoginUserInput } from '../../user-input-validation-schema/login-schema';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';
import { HTTP_STATUS_CODES } from '@/lib/status-codes';
import { UserRepo } from '@/repository/UserRepo';

export default catchAsync(async function loginHandler(
  req: Request<object, object, LoginUserInput>,
  res: Response,
  next: NextFunction,
) {
  const userRepo = new UserRepo();
  const { email, password } = req.body;

  const user: IUserDocument = (await userRepo.findOne({
    email,
  })) as IUserDocument;

  if (!user || user.status === UserStatuses.DELETED) {
    return next(
      new AppError(
        ERROR_MESSAGES.AUTH.EMAIL_DOES_NOT_EXIST,
        HTTP_STATUS_CODES.UNAUTHORIZED,
      ),
    );
  }

  if (user.status === UserStatuses.LOCKED_OUT)
    return next(
      new AppError(
        ERROR_MESSAGES.AUTH.ACCOUNT_LOCKED,
        HTTP_STATUS_CODES.UNAUTHORIZED,
      ),
    );

  if (!(await argon2.verify(user.password, password))) {
    return next(
      new AppError(
        ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
        HTTP_STATUS_CODES.UNAUTHORIZED,
      ),
    );
  }

  req.session.userId = user._id;
  req.session.userName = user.fullName;
  req.session.profileId = user.profileId;
  req.session.role = user.role;

  res.status(HTTP_STATUS_CODES.OK).json({ user: new SanitizedUser(user) });
});
