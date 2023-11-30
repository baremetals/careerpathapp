import { Schema } from 'mongoose';
import { ISuitabilityScoreReturnType, mapScoresToIndustries } from '.';
import { ERROR_MESSAGES } from '../../lib/error-messages';
import { IndustryModel } from '../../models/Industry';
import { SuitabilityScoreModel } from '../../models/SuitabilityScore';
import AppError from '../../utils/appError';

type TSaveSuitabilityScores = {
  scores: ISuitabilityScoreReturnType;
  profileId: Schema.Types.ObjectId;
  userName: string;
};
export default async function updateSuitabilityScores({
  scores,
  profileId,
  userName,
}: TSaveSuitabilityScores) {
  try {
    const industries = await IndustryModel.find();
    console.log(
      'The User Name-------------------------<',
      //   industries,
    );

    const suitabilityScores = mapScoresToIndustries(
      industries,
      scores.suitability_scores,
      (score, industry) => score.industryName === industry.name,
    );
    const selectedIndustriesScores = mapScoresToIndustries(
      industries,
      scores.selected_industries_scores,
      (score, industry) => score.industryName === industry.name,
    );

    const scoresDoc = await SuitabilityScoreModel.findOneAndUpdate(
      { profileId },
      {
        industriesAndScores: suitabilityScores,
        chosenIndustriesAndScores: selectedIndustriesScores,
        lastModifiedBy: userName,
        lastModifiedAt: new Date(),
      },
    );

    if (!scoresDoc)
      throw new AppError(
        ERROR_MESSAGES.CAREER_PATH.ISSUE_SAVING_RESPONSES,
        401,
      );
  } catch (error) {
    console.log(error);
    throw new AppError(ERROR_MESSAGES.CAREER_PATH.ISSUE_SAVING_RESPONSES, 400);
  }
}
