import { Types } from 'mongoose';
import { CareerPathResponseAndWeightModel } from '../../models/CareerPathResponseAndWeight';
import { UserQuestionResponseModel } from '../../models/UserQuestionResponse';
// import { ICareerPathDocument } from '../../interfaces/careerPath';
// import { IJobRoleDocument } from 'interfaces/careerPath';

async function getRulesForQuestion(industryId: Types.ObjectId) {
  return CareerPathResponseAndWeightModel.find({
    industry: industryId,
  }).exec();
}

async function getUserResponse(userId: string) {
  return UserQuestionResponseModel.find({ user: userId }).exec();
}

export { getRulesForQuestion, getUserResponse };
