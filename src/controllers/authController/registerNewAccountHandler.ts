import { NextFunction, Request, Response } from 'express';
import {
  ACCOUNT_ACTIVATION_PARTIAL_URL,
  ACCOUNT_CREATION_SESSION_PREFIX,
  SESSION_EXPIRATION_SECONDS,
} from '@/lib/constants';
import { ERROR_MESSAGES } from '@/lib/error-messages';
import { UserRepo } from '@/repository/UserRepo';
import { SessionService } from '@/services/SessionService';
import { TokenService } from '@/services/TokenService';
import { UserRegistrationUserInput } from '@/user-input-validation-schema/register-user-schema';
import AppError from '@/utils/appError';
import catchAsync from '@/utils/catchAsync';
import { IUserDocument } from '@/interfaces/user';
import { HTTP_STATUS_CODES } from '@/lib/status-codes';
import { SQSService } from '@/services/NotificationService/SQSSERVICE';
import { accountActivationTemplate } from '@/services/NotificationService/email-templates/accountActivationTemplate';

export default catchAsync(async function registerNewAccountHandler(
  req: Request<object, object, UserRegistrationUserInput>,
  res: Response,
  next: NextFunction,
) {
  const userRepo = new UserRepo();
  const tokenService = new TokenService();
  const sessionService = new SessionService();
  const sqsService = new SQSService();
  const { firstName, lastName, email, password } = req.body;

  const emailAlreadyExists: IUserDocument = (await userRepo.findOne({
    email: req.body.email,
  })) as IUserDocument;

  if (emailAlreadyExists) {
    return next([
      new AppError(
        ERROR_MESSAGES.AUTH.EMAIL_IN_USE_OR_UNAVAILABLE,
        HTTP_STATUS_CODES.FORBIDDEN,
      ),
    ]);
  }

  const token = tokenService.signToken(
    { email },
    process.env.ACCOUNT_ACTIVATION_TOKEN_PRIVATE_KEY as string,
    {
      expiresIn: parseInt(
        process.env.ACCOUNT_ACTIVATION_SESSION_EXPIRATION as string,
      ),
    },
  );

  await sessionService.setSession(
    ACCOUNT_CREATION_SESSION_PREFIX + email,
    JSON.stringify({ email, firstName, lastName, password }),
    SESSION_EXPIRATION_SECONDS,
  );

  try {
    const url = `${req.protocol}://${req.get(
      'host',
    )}/${ACCOUNT_ACTIVATION_PARTIAL_URL}/${token}`;

    const htmlTemplate = accountActivationTemplate(firstName, url);
    const receiver = [email];

    await sqsService.sendMessage(
      process.env.ACCOUNT_ACTIVATION_QUEUE_URL as string,
      {
        to: receiver,
        subject: 'Activate Account',
        htmlTemplate,
      },
    );

    res.status(HTTP_STATUS_CODES.NO_CONTENT).json();
  } catch (err) {
    return next(
      new AppError(
        ERROR_MESSAGES.SERVER_GENERIC,
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      ),
    );
  }
});
