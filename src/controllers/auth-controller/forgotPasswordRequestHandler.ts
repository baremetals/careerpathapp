import Redis from 'ioredis';
import { UserStatuses } from '../../lib/auth-validation-config';
import { RESET_PASSWORD } from '../../lib/constants';
import { ERROR_MESSAGES } from '../../lib/error-messages';
import { UserModel } from '../../models/User';
import { EmailService } from '../../services/EmailService';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';
import { signJwtAsymmetric } from '../utils/jwt';

export default catchAsync(async function forgotPasswordRequestHandler(
  req,
  res,
  next,
) {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user || user.status === UserStatuses.DELETED) {
    return next(new AppError(ERROR_MESSAGES.AUTH.EMAIL_DOES_NOT_EXIST, 404));
  }
  if (user.status === UserStatuses.BANNED)
    return next(new AppError(ERROR_MESSAGES.AUTH.ACCOUNT_BANNED, 401));

  // const payload = { user: { email: user.email } };
  // const passwordResetToken = signJwtSymmetric(payload, user.password, {
  //   expiresIn: `${
  //     parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRES_IN as string, 10) /
  //     1000 /
  //     60
  //   }m`,
  // });

  const passwordResetToken = signJwtAsymmetric(
    { user: user.email },
    process.env.ACCOUNT_ACTIVATION_TOKEN_PRIVATE_KEY as string,
    {
      expiresIn: process.env.ACCOUNT_ACTIVATION_SESSION_EXPIRATION,
    },
  );
  const redis = new Redis();
  await redis.set(
    RESET_PASSWORD + passwordResetToken,
    user.email,
    'EX',
    1000 * 60 * 60 * 24 * 2,
  ); // 48hr

  try {
    const resetURL = `${req.protocol}://${req.get(
      'host',
    )}/api/auth/reset-password/${passwordResetToken}`;
    await new EmailService(user, resetURL).sendPasswordResetEmail();

    res.status(200).json({
      status: 'success',
      message: 'Please check your email for the reset password link',
    });
  } catch (err) {
    return next(new AppError(ERROR_MESSAGES.AUTH.CHANGE_PASSWORD_EMAIL, 500));
  }
});
