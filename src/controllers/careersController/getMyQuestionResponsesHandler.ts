import { Request, Response } from 'express';
import { UserQuestionResponseModel } from '../../models/UserQuestionResponse';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../utils/appError';
import { ERROR_MESSAGES } from '../../lib/error-messages';

export default catchAsync(async function getMyQuestionResponsesHandler(
  req: Request,
  res: Response,
) {
  const responseDoc = await UserQuestionResponseModel.findOne({
    profileId: req.session.profileId,
  });

  if (!responseDoc)
    throw new AppError(ERROR_MESSAGES.CAREER_PATH.ISSUE_SAVING_RESPONSES, 401);

  res.status(202).json({
    data: responseDoc,
  });
});
