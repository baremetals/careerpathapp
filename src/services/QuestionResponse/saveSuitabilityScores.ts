import { Schema } from 'mongoose';
import { ISuitabilityScoreReturnType, mapScoresToIndustries } from '.';
import { ERROR_MESSAGES } from '../../lib/error-messages';
import { IndustryModel } from '../../models/Industry';
import { SuitabilityScoreModel } from '../../models/SuitabilityScore';
import { UserProfileModel } from '../../models/UserProfile';
import AppError from '../../utils/appError';

type TSaveSuitabilityScores = {
  scores: ISuitabilityScoreReturnType;
  profileId: Schema.Types.ObjectId;
  userName: string;
};
export default async function saveSuitabilityScores({
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

    const scoresDoc = await SuitabilityScoreModel.create({
      profileId,
      industriesAndScores: suitabilityScores,
      chosenIndustriesAndScores: selectedIndustriesScores,
      createdBy: userName,
      lastModifiedBy: userName,
    });

    if (!scoresDoc)
      throw new AppError(
        ERROR_MESSAGES.CAREER_PATH.ISSUE_SAVING_RESPONSES,
        401,
      );

    const userProfile = await UserProfileModel.findById(profileId);

    if (userProfile) {
      userProfile.suitabilityScoresId = scoresDoc._id;
      userProfile.lastModifiedAt = new Date();
      userProfile.lastModifiedBy = userName;
      userProfile.save({ validateBeforeSave: false });
    }
  } catch (error) {
    console.log(error);
    throw new AppError(ERROR_MESSAGES.CAREER_PATH.ISSUE_SAVING_RESPONSES, 400);
  }
}
