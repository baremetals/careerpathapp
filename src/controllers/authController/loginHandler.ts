import * as argon2 from 'argon2';
import { NextFunction, Request, Response } from 'express';
import { SanitizedUser } from '../../interfaces/user';
import { UserStatuses } from '../../lib/auth-validation-config';
import { ERROR_MESSAGES } from '../../lib/error-messages';
import { LoginUserInput } from '../../user-input-validation-schema/login-schema';
import { UserModel } from '../../models/User';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';

export default catchAsync(async function loginHandler(
  req: Request<object, object, LoginUserInput>,
  res: Response,
  next: NextFunction,
) {
  // console.log('===============>', req.body)
  const { email, password } = req.body;

  const user = await UserModel.findOne({
    email,
  }).select('+password');

  if (!user || user.status === UserStatuses.DELETED) {
    return next(new AppError(ERROR_MESSAGES.AUTH.EMAIL_DOES_NOT_EXIST, 401));
  }

  if (user.status === UserStatuses.LOCKED_OUT)
    return next(new AppError(ERROR_MESSAGES.AUTH.ACCOUNT_LOCKED, 401));

  if (!(await argon2.verify(user.password, password))) {
    return next(new AppError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS, 401));
  }

  req.session.userId = user._id;
  req.session.userName = user.fullName;
  req.session.profileId = user.profileId;
  req.session.role = user.role ? user.role : 'user';

  res.status(201).json({ user: new SanitizedUser(user) });
});
