import { verifyJwtAsymmetric } from 'controllers/utils/jwt';
import { NextFunction, Request, Response } from 'express';
import Redis from 'ioredis';
import { ERROR_MESSAGES } from 'lib/error-messages';
import { ACCOUNT_CREATION_SESSION_PREFIX } from '../../lib/constants';
import { UserModel } from '../../models/User';
import { createUserInitialProfile } from '../../services/UserService';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';

export default catchAsync(async function accountActivationHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { token } = req.body;
  if (!token)
    return next(
      new AppError(ERROR_MESSAGES.AUTH.INVALID_OR_EXPIRED_TOKEN, 401),
    );
  const decoded: { email: string } | null = verifyJwtAsymmetric(
    token,
    process.env.ACCOUNT_ACTIVATION_TOKEN_PUBLIC_KEY as string,
  );
  if (!decoded)
    return next(
      new AppError(ERROR_MESSAGES.AUTH.INVALID_OR_EXPIRED_TOKEN, 401),
    );
  const { email } = decoded;
  const redis = new Redis();
  const key = ACCOUNT_CREATION_SESSION_PREFIX + email;
  const accountActivationSession = await redis.get(key);
  if (!accountActivationSession)
    return next(
      new AppError(ERROR_MESSAGES.AUTH.INVALID_OR_EXPIRED_TOKEN, 401),
    );
  const parsedSession = JSON.parse(accountActivationSession);
  const { firstName, lastName, password } = parsedSession;
  const fullName = `${firstName} ${lastName}`;

  const newUser = await UserModel.create({
    firstName,
    lastName,
    fullName,
    email: email.trim().toLowerCase(),
    password,
    isActive: true,
    createdBy: fullName,
    lastModifiedBy: fullName,
  });

  const profile = await createUserInitialProfile(newUser._id, fullName);

  newUser.profileId = profile._id;
  newUser.lastModifiedAt = new Date();
  newUser.lastModifiedBy = fullName;
  newUser.save({ validateBeforeSave: false });

  await redis.del(key);

  res.status(201).json({
    status: 'success',
    message: 'Your user account has been activated.',
    data: { user: newUser },
  });
});
