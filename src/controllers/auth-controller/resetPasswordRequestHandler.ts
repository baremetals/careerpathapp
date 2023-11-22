import * as argon2 from 'argon2';
import Redis from 'ioredis';
import { UserStatuses } from '../../lib/auth-validation-config';
import { RESET_PASSWORD } from '../../lib/constants';
import { ERROR_MESSAGES } from '../../lib/error-messages';
import { UserModel } from '../../models/User';
import { EmailService } from '../../services/EmailService';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';
import { verifyJwtAsymmetric } from '../utils/jwt';

export default catchAsync(async function resetPasswordRequestHandler(
  req,
  res,
  next,
) {
  const { token } = req.params;
  if (!token)
    return next(
      new AppError(ERROR_MESSAGES.AUTH.INVALID_OR_EXPIRED_TOKEN, 401),
    );
  try {
    const redis = new Redis();
    const key = RESET_PASSWORD + token;
    const email = await redis.get(key);
    // console.log('THE EMAIL---------------->', email);

    if (!email) {
      return next(
        new AppError(ERROR_MESSAGES.AUTH.INVALID_OR_EXPIRED_TOKEN, 401),
      );
    }

    const user = await UserModel.findOne({ email }).select('+password');

    if (!user || user.status === UserStatuses.DELETED) {
      return next(new AppError(ERROR_MESSAGES.AUTH.NO_USER_EXISTS, 401));
    }
    if (user.status === UserStatuses.BANNED)
      return next([new AppError(ERROR_MESSAGES.AUTH.ACCOUNT_BANNED, 401)]);
    const decoded: { email: string } | null = verifyJwtAsymmetric(
      token,
      process.env.ACCOUNT_ACTIVATION_TOKEN_PUBLIC_KEY as string,
    );
    if (!decoded)
      return next(
        new AppError(ERROR_MESSAGES.AUTH.INVALID_OR_EXPIRED_TOKEN, 401),
      );

    if (decoded.email !== user.email)
      return next(
        new AppError(
          ERROR_MESSAGES.AUTH.PASSWORD_RESET_EMAIL_DOES_NOT_MATCH_TOKEN,
          401,
        ),
      );

    if (await argon2.verify(user.password, req.body.password)) {
      return next(
        new AppError(
          ERROR_MESSAGES.AUTH.NEW_PASSWORD_MATCH_CURRENT_PASSWORD,
          401,
        ),
      );
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.lastModifiedBy = user.fullName;
    user.lastModifiedAt = new Date();
    await user.save();

    await redis.del(key);
    await new EmailService(user).sendPasswordChangeEmail();

    res.status(201).json({
      status: 'success',
      message: 'Your password has been changed, you may now log in',
    });
  } catch (error) {
    // console.log('Error---------------------------------->', error);
    return next(
      new AppError(ERROR_MESSAGES.AUTH.INVALID_OR_EXPIRED_TOKEN, 401),
    );
  }
});
