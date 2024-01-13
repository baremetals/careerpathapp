import { UserStatuses } from '@/lib/auth-validation-config';
import { ERROR_MESSAGES } from '@/lib/error-messages';
import { HTTP_STATUS_CODES } from '@/lib/status-codes';
import { UserRepo } from '@/repository/UserRepo';
import { SQSService } from '@/services/NotificationService/SQSSERVICE';
import { passwordChangedTemplate } from '@/services/NotificationService/email-templates/passwordChangedTemplate';
import AppError from '@/utils/appError';
import catchAsync from '@/utils/catchAsync';
import * as argon2 from 'argon2';

export default catchAsync(async function changePasswordHandler(req, res, next) {
  const userRepo = new UserRepo();
  const sqsService = new SQSService();
  const user = await userRepo.findById(req.session.userId);
  // console.log(req.body.currentPassword);

  if (!user || user.status === UserStatuses.DELETED) {
    return next(
      new AppError(
        ERROR_MESSAGES.AUTH.NO_USER_EXISTS,
        HTTP_STATUS_CODES.NOT_FOUND,
      ),
    );
  }
  if (user.status === UserStatuses.BANNED)
    return next([
      new AppError(
        ERROR_MESSAGES.AUTH.ACCOUNT_BANNED,
        HTTP_STATUS_CODES.UNAUTHORIZED,
      ),
    ]);

  if (!(await argon2.verify(user.password, req.body.currentPassword))) {
    return next(
      new AppError(
        ERROR_MESSAGES.VALIDATION.AUTH.INVALID_PASSWORD,
        HTTP_STATUS_CODES.UNAUTHORIZED,
      ),
    );
  }

  if (await argon2.verify(user.password, req.body.newPassword)) {
    return next(
      new AppError(
        ERROR_MESSAGES.AUTH.NEW_PASSWORD_MATCH_CURRENT_PASSWORD,
        HTTP_STATUS_CODES.UNAUTHORIZED,
      ),
    );
  }

  await userRepo.resetPassword(
    user._id,
    req.body.newPassword,
    req.body.confirmPassword,
  );

  try {
    const homeUrl = `${process.env.Client_URL}/auth/login`;

    const htmlTemplate = passwordChangedTemplate(user.firstName, homeUrl);
    const receiver = [user.email];

    await sqsService.sendMessage(
      process.env.PASSWORD_CHANGED_QUEUE_URL as string,
      {
        to: receiver,
        subject: 'Password Changed',
        htmlTemplate,
      },
    );
  } catch (err) {
    return next(
      new AppError(
        ERROR_MESSAGES.SERVER_GENERIC,
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      ),
    );
  }

  res.status(HTTP_STATUS_CODES.OK).json({});
});
