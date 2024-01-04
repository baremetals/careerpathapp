import { IUserQuestionResponseDocument } from '@/interfaces/userProfile';
import { ERROR_MESSAGES } from '@/lib/error-messages';
import { UserQuestionResponseModel } from '@/models/UserQuestionResponse';
import AppError from '@/utils/appError';

export default async function updateQuestionnaireResponse(
  responses: IUserQuestionResponseDocument,
  userName: string,
) {
  try {
    const responsesDoc = await UserQuestionResponseModel.findByIdAndUpdate(
      responses._id,
      {
        selectedIndustries: responses.selectedIndustries,
        selectedInterests: responses.selectedInterests,
        responses: responses.responses,
        lastModifiedBy: userName,
        lastModifiedAt: new Date(),
      },
    );
    if (!responsesDoc)
      throw new AppError(
        ERROR_MESSAGES.CAREER_PATH.ISSUE_SAVING_RESPONSES,
        401,
      );
  } catch (error) {
    console.log(error);
    throw new AppError(ERROR_MESSAGES.CAREER_PATH.ISSUE_SAVING_RESPONSES, 400);
  }
}
