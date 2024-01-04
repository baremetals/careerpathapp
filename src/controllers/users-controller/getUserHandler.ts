import { IUserDocument, SanitizedUser } from '@/interfaces/user';
import { ERROR_MESSAGES } from '@/lib/error-messages';
import { HTTP_STATUS_CODES } from '@/lib/status-codes';
import { UserRepo } from '@/repository/UserRepo';
import AppError from '@/utils/appError';
import catchAsync from '@/utils/catchAsync';
import { NextFunction, Request, Response } from 'express';

export default catchAsync(async function getUserHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const options: {
    notFoundMessage?: string;
    populateOptions?: string | Array<string>;
  } = {
    notFoundMessage: ERROR_MESSAGES.FACTORY.DOC_NOT_FOUND,
    populateOptions: Array.isArray(req.query.populateOptions)
      ? (req.query.populateOptions as string[]).map((option: string) =>
          String(option),
        )
      : String(req.query.populateOptions),
  };
  const userRepo = new UserRepo();

  const query = Array.isArray(options.populateOptions)
    ? options.populateOptions.join(' ')
    : options.populateOptions;
  const user: IUserDocument = (await userRepo.findById(
    req.params.id,
    query,
  )) as IUserDocument;

  if (!user) {
    return next(
      new AppError(
        options.notFoundMessage as string,
        HTTP_STATUS_CODES.NOT_FOUND,
      ),
    );
  }
  res.status(HTTP_STATUS_CODES.OK).json({
    data: { user: new SanitizedUser(user) },
  });
});
