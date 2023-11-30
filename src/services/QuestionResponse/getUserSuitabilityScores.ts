import { ISuitabilityScoreReturnType } from '.';
import { IUserQuestionResponseDocument } from '../../interfaces/userProfile';
import fetchHook from '../../utils/fetchHook';

type TQuestionsResponses = {
  inputs: IUserQuestionResponseDocument[];
};
export default async function getUserSuitabilityScores(
  responses: IUserQuestionResponseDocument,
): Promise<ISuitabilityScoreReturnType> {
  const inputs: IUserQuestionResponseDocument[] = [];
  inputs.push(responses);
  const questionsResponses: TQuestionsResponses = { inputs: inputs };

  return fetchHook(
    process.env.CAREER_APP_MODEL_SERVER_URL as string,
    questionsResponses,
  );
}
