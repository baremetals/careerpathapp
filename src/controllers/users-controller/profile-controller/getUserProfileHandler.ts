import { IUserProfileDocument } from '@/interfaces/user';
import { ERROR_MESSAGES } from '@/lib/error-messages';
import { HTTP_STATUS_CODES } from '@/lib/status-codes';
import { ProfileRepo } from '@/repository/ProfileRepo';
import AppError from '@/utils/appError';
import catchAsync from '@/utils/catchAsync';
import { NextFunction, Request, Response } from 'express';

export default catchAsync(async function getUserProfileHandler(
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
  const profileRepo = new ProfileRepo();

  const query = Array.isArray(options.populateOptions)
    ? options.populateOptions.join(' ')
    : options.populateOptions;
  const userProfile: IUserProfileDocument = (await profileRepo.findById(
    req.params.id,
    query,
  )) as IUserProfileDocument;

  if (!userProfile) {
    return next(
      new AppError(
        options.notFoundMessage as string,
        HTTP_STATUS_CODES.NOT_FOUND,
      ),
    );
  }
  res.status(HTTP_STATUS_CODES.OK).json({
    data: { profile: userProfile },
  });
});
