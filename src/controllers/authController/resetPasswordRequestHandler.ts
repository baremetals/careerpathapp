import * as argon2 from 'argon2';
import { UserStatuses } from '@/lib/auth-validation-config';
import { RESET_PASSWORD } from '@/lib/constants';
import { ERROR_MESSAGES } from '@/lib/error-messages';
import AppError from '@/utils/appError';
import catchAsync from '@/utils/catchAsync';
import { UserRepo } from '@/repository/UserRepo';
import { SessionService } from '@/services/SessionService';
import { SQSService } from '@/services/NotificationService/SQSSERVICE';
import { HTTP_STATUS_CODES } from '@/lib/status-codes';
import { IUserDocument } from '@/interfaces/user';
import { passwordChangedTemplate } from '@/services/NotificationService/email-templates/passwordChangedTemplate';

export default catchAsync(async function resetPasswordRequestHandler(
  req,
  res,
  next,
) {
  const userRepo = new UserRepo();
  const sessionService = new SessionService();
  const sqsService = new SQSService();
  const { token } = req.params;
  const { email } = req.decoded; // Access the 'email' property instead of 'user'
  const key = RESET_PASSWORD + token;

  const user: IUserDocument = (await userRepo.findOne({
    email,
  })) as IUserDocument;

  if (!user || user.status === UserStatuses.DELETED) {
    return next(
      new AppError(
        ERROR_MESSAGES.AUTH.NO_USER_EXISTS,
        HTTP_STATUS_CODES.UNAUTHORIZED,
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

  if (email !== user.email)
    return next(
      new AppError(
        ERROR_MESSAGES.AUTH.PASSWORD_RESET_EMAIL_DOES_NOT_MATCH_TOKEN,
        HTTP_STATUS_CODES.UNAUTHORIZED,
      ),
    );

  if (await argon2.verify(user.password, req.body.password)) {
    return next(
      new AppError(
        ERROR_MESSAGES.AUTH.NEW_PASSWORD_MATCH_CURRENT_PASSWORD,
        HTTP_STATUS_CODES.UNAUTHORIZED,
      ),
    );
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.lastModifiedBy = user.fullName;
  user.lastModifiedAt = new Date();
  await user.save();

  await sessionService.deleteSession(key);

  try {
    const homeUrl = `${req.protocol}://${req.get('host')}`;

    const htmlTemplate = passwordChangedTemplate(user.firstName, homeUrl);
    const receiver = [email];

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

  res.status(HTTP_STATUS_CODES.NO_CONTENT).json();
});
