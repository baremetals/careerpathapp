import { NextFunction, Request, Response } from 'express';
import Redis from 'ioredis';
import { ACCOUNT_CREATION_SESSION_PREFIX } from '../../lib/constants';
import { ERROR_MESSAGES } from '../../lib/error-messages';
import { UserModel } from '../../models/User';
import { EmailService } from '../../services/EmailService';
import { UserRegistrationUserInput } from '../../user-input-validation-schema/register-user-schema';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';
import { signJwtAsymmetric } from '../utils/jwt';

export default catchAsync(async function registerNewAccountHandler(
  req: Request<object, object, UserRegistrationUserInput>,
  res: Response,
  next: NextFunction,
) {
  const { firstName, lastName, email, password } = req.body;

  const emailAlreadyExists = await UserModel.findOne({
    email: req.body.email,
  });

  if (emailAlreadyExists) {
    // console.log('===============>', user);
    return next([
      new AppError(ERROR_MESSAGES.AUTH.EMAIL_IN_USE_OR_UNAVAILABLE, 403),
    ]);
  }

  const token = signJwtAsymmetric(
    { email },
    process.env.ACCOUNT_ACTIVATION_TOKEN_PRIVATE_KEY as string,
    {
      expiresIn: process.env.ACCOUNT_ACTIVATION_SESSION_EXPIRATION,
    },
  );

  // console.log('============', token);

  const redis = new Redis();

  await redis.set(
    ACCOUNT_CREATION_SESSION_PREFIX + email,
    JSON.stringify({ email, firstName, lastName, password }),
    'EX',
    60 * 60 * 24 * 2,
  ); // 48 hours
  const url = `${req.protocol}://${req.get(
    'host',
  )}/api/auth/account-activation/${token}`;

  await new EmailService(
    { email, firstName },
    url,
  ).sendAccountRegistrationEmail();

  res.status(201).json({
    message:
      'Your request has been processed, please activate your account to begin.',
  });
});
