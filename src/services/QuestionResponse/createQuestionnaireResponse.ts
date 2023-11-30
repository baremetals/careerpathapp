import { IUserQuestionResponseDocument } from '../../interfaces/userProfile';
import { ERROR_MESSAGES } from '../../lib/error-messages';
import { UserProfileModel } from '../../models/UserProfile';
import { UserQuestionResponseModel } from '../../models/UserQuestionResponse';
import AppError from '../../utils/appError';

export default async function createQuestionnaireResponse(
  responses: IUserQuestionResponseDocument,
  userName: string,
) {
  try {
    const responsesDoc = await UserQuestionResponseModel.create({
      ...responses,
      createdBy: userName,
      lastModifiedBy: userName,
    });

    if (!responsesDoc)
      throw new AppError(
        ERROR_MESSAGES.CAREER_PATH.ISSUE_SAVING_RESPONSES,
        401,
      );
    const userProfile = await UserProfileModel.findById(responses.profileId);

    if (userProfile) {
      userProfile.questionsResponsesId = responsesDoc._id;
      userProfile.lastModifiedAt = new Date();
      userProfile.lastModifiedBy = userName;
      userProfile.save({ validateBeforeSave: false });
    }
  } catch (error) {
    console.log(error);
    throw new AppError(ERROR_MESSAGES.CAREER_PATH.ISSUE_SAVING_RESPONSES, 400);
  }
}
