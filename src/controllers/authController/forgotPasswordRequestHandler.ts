import { IUserDocument } from '@/interfaces/user';
import { UserStatuses } from '@/lib/auth-validation-config';
import {
  RESET_PASSWORD,
  RESET_PASSWORD_PARTIAL_URL,
  SESSION_EXPIRATION_SECONDS,
} from '@/lib/constants';
import { ERROR_MESSAGES } from '@/lib/error-messages';
import { HTTP_STATUS_CODES } from '@/lib/status-codes';
import { UserRepo } from '@/repository/UserRepo';
import { SQSService } from '@/services/NotificationService/SQSSERVICE';
import { resetPasswordTemplate } from '@/services/NotificationService/email-templates/resetPasswordTemplate';
import { SessionService } from '@/services/SessionService';
import AppError from '@/utils/appError';
import catchAsync from '@/utils/catchAsync';
import { createToken } from './utils';

export default catchAsync(async function forgotPasswordRequestHandler(
  req,
  res,
  next,
) {
  const userRepo = new UserRepo();
  const sessionService = new SessionService();
  const sqsService = new SQSService();

  const user: IUserDocument = (await userRepo.findOne({
    email: req.body.email,
  })) as IUserDocument;

  if (!user || user.status === UserStatuses.DELETED) {
    return next(
      new AppError(
        ERROR_MESSAGES.AUTH.EMAIL_DOES_NOT_EXIST,
        HTTP_STATUS_CODES.NOT_FOUND,
      ),
    );
  }
  if (user.status === UserStatuses.BANNED)
    return next(
      new AppError(
        ERROR_MESSAGES.AUTH.ACCOUNT_BANNED,
        HTTP_STATUS_CODES.UNAUTHORIZED,
      ),
    );

  const passwordResetToken = await createToken(user.email);

  // console.log(
  //   'passwordResetToken------------------------->',
  //   passwordResetToken,
  // );
  await sessionService.setSession(
    RESET_PASSWORD + passwordResetToken,
    user.email,
    SESSION_EXPIRATION_SECONDS,
  );

  try {
    const resetURL = `${process.env.Client_URL}/${RESET_PASSWORD_PARTIAL_URL}/${passwordResetToken}`;
    const htmlTemplate = resetPasswordTemplate(user.firstName, resetURL);
    const receiver = [user.email];

    await sqsService.sendMessage(
      process.env.RESET_PASSWORD_QUEUE_URL as string,
      {
        to: receiver,
        subject: 'Reset Password',
        htmlTemplate,
      },
    );

    res.status(HTTP_STATUS_CODES.OK).json({});
  } catch (err) {
    return next(
      new AppError(
        ERROR_MESSAGES.SERVER_GENERIC,
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      ),
    );
  }
});
