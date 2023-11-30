import { NextFunction, Request, Response } from 'express';
import { SanitizedUser } from '../../interfaces/user';
import { ERROR_MESSAGES } from '../../lib/error-messages';
import { UserModel } from '../../models/User';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';

export default catchAsync(async function getUserHandler(
  req: Request,
  res: Response,
  next: NextFunction,
  options: {
    notFoundMessage?: string;
    populateOptions?: string | Array<string>;
  } = {
    notFoundMessage: ERROR_MESSAGES.FACTORY.DOC_NOT_FOUND,
    populateOptions: '',
  },
) {
  const query = Array.isArray(options.populateOptions)
    ? options.populateOptions.join(' ')
    : options.populateOptions;
  const user = UserModel.findById(req.params.id).populate(
    query as string | Array<string>,
  );
  const userDoc = await user.exec();
  if (!userDoc) {
    return next(new AppError(options.notFoundMessage as string, 404));
  }
  res.status(200).json({
    data: { user: new SanitizedUser(userDoc) },
  });
});
