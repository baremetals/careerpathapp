import { IUserDocument } from '@/interfaces/user';
import {
  ACCOUNT_CREATION_SESSION_PREFIX,
  SESSION_EXPIRATION_SECONDS,
} from '@/lib/constants';
import { ERROR_MESSAGES } from '@/lib/error-messages';
import { HTTP_STATUS_CODES } from '@/lib/status-codes';
import { UserRepo } from '@/repository/UserRepo';
import { SessionService } from '@/services/SessionService';
import { UserRegistrationUserInput } from '@/user-input-validation-schema/register-user-schema';
import AppError from '@/utils/appError';
import catchAsync from '@/utils/catchAsync';
import { NextFunction, Request, Response } from 'express';
import { addToSQSQueue, createToken } from './utils';

export default catchAsync(async function registerNewAccountHandler(
  req: Request<object, object, UserRegistrationUserInput>,
  res: Response,
  next: NextFunction,
) {
  const userRepo = new UserRepo();
  const sessionService = new SessionService();
  const { firstName, lastName, password, email } = req.body;

  // console.log('email=====>', email)

  const emailAlreadyExists: IUserDocument = (await userRepo.findOne({
    email,
  })) as IUserDocument;

  if (emailAlreadyExists) {
    return next([
      new AppError(
        ERROR_MESSAGES.AUTH.EMAIL_IN_USE_OR_UNAVAILABLE,
        HTTP_STATUS_CODES.FORBIDDEN,
      ),
    ]);
  }
  const token = await createToken(email);

  await sessionService.setSession(
    ACCOUNT_CREATION_SESSION_PREFIX + email,
    JSON.stringify({ email, firstName, lastName, password }),
    SESSION_EXPIRATION_SECONDS,
  );

  try {
    await addToSQSQueue(email, firstName, String(token));

    res.status(HTTP_STATUS_CODES.ACCEPTED).json({});
  } catch (err) {
    return next(
      new AppError(
        ERROR_MESSAGES.SERVER_GENERIC,
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      ),
    );
  }
});
