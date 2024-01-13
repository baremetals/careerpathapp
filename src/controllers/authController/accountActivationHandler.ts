import { ACCOUNT_CREATION_SESSION_PREFIX } from '@/lib/constants';
import { ERROR_MESSAGES } from '@/lib/error-messages';
import { HTTP_STATUS_CODES } from '@/lib/status-codes';
import { ProfileRepo } from '@/repository/ProfileRepo';
import { UserRepo } from '@/repository/UserRepo';
import { SQSService } from '@/services/NotificationService/SQSSERVICE';
import { welcomeTemplate } from '@/services/NotificationService/email-templates/welcomeTemplate';
import { SessionService } from '@/services/SessionService';
import AppError from '@/utils/appError';
import catchAsync from '@/utils/catchAsync';
import { NextFunction, Request, Response } from 'express';

export default catchAsync(async function accountActivationHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { email } = req.decoded;
  const sessionService = new SessionService();
  const userRepo = new UserRepo();
  const profileRepo = new ProfileRepo();
  const sqsService = new SQSService();

  // console.log('email', email)

  const key = ACCOUNT_CREATION_SESSION_PREFIX + email;
  const accountActivationSession = await sessionService.getSession(key);
  if (!accountActivationSession)
    return next(
      new AppError(
        ERROR_MESSAGES.AUTH.USED_OR_EXPIRED_ACCOUNT_CREATION_SESSION,
        HTTP_STATUS_CODES.UNAUTHORIZED,
      ),
    );
  const parsedSession = JSON.parse(accountActivationSession);
  const { firstName, lastName, password } = parsedSession;

  const newUser = await userRepo.createUser(
    firstName,
    lastName,
    email,
    password,
  );
  const profile = await profileRepo.createProfile(
    newUser._id,
    newUser.fullName,
  );
  await userRepo.updateUserWithProfileId(newUser._id, profile._id);
  await sessionService.deleteSession(key);

  try {
    const homeUrl = `${process.env.Client_URL}/auth/login`;

    const htmlTemplate = welcomeTemplate(firstName, homeUrl);
    const receiver = [email];

    await sqsService.sendMessage(
      process.env.ACCOUNT_ACTIVATION_QUEUE_URL as string,
      {
        to: receiver,
        subject: 'Welcome to the Careers App',
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

  res.status(HTTP_STATUS_CODES.CREATED).json({});
});
