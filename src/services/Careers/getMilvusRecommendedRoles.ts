import { Schema } from 'mongoose';
import { ICareersAndRolesReturnType } from '.';
import { TSuitabilityScoreType } from '../../interfaces/userProfile';
import fetchHook from '../../utils/fetchHook';

type TInterestsAndIndustries = {
  user_interest: Array<Schema.Types.ObjectId>;
  chosen_industries: Array<TSuitabilityScoreType>;
};
export default async function getMilvusRecommendedRoles({
  user_interest,
  chosen_industries,
}: TInterestsAndIndustries): Promise<ICareersAndRolesReturnType> {
  return fetchHook(`${process.env.CAREER_APP_MODEL_SERVER_URL}/embeddings`, {
    user_interest,
    chosen_industries,
  });
}
