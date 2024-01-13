// import { NextFunction, Request, Response } from 'express';
// import catchAsync from '@/utils/catchAsync';
// import Factory from '@/factory';
import Factory from '@/factory';
import { CareerPathModel } from '@/models/CareerPath';
import { CareerPathResponseAndWeightModel } from '@/models/CareerPathResponseAndWeight';
import { IndustryModel } from '@/models/Industry';
import { InterestModel } from '@/models/Interest';
import { JobRoleModel } from '@/models/JobRole';
import { QuestionModel } from '@/models/Question';
import { SkillModel } from '@/models/Skill';
import { UserProfileModel } from '@/models/UserProfile';
import { saveQuestionsAndResponses } from '@/services/AdminServices';

// Questions
export const createQuestion = Factory.createOne({ Model: QuestionModel });
// export const createManyQuestions = Factory.createMany(QuestionModel)
export const createManyQuestions = saveQuestionsAndResponses();
export const getOneQuestion = Factory.getOne(QuestionModel);
export const getAllQuestions = Factory.getMany({ Model: QuestionModel });
export const updateManyQuestions = Factory.updateMany(QuestionModel);

// Industries
export const createIndustry = Factory.createOne({ Model: IndustryModel });
export const createManyIndustries = Factory.createMany({
  Model: IndustryModel,
});
export const getOneIndustry = Factory.getOne(IndustryModel);
export const getAllIndustries = Factory.getMany({ Model: IndustryModel });

// career Paths
export const createCareerPath = Factory.createOne({ Model: CareerPathModel });
export const createManyCareerPaths = Factory.createMany({
  Model: CareerPathModel,
});
export const getOneCareerPath = Factory.getOne(CareerPathModel);
export const getAllCareerPaths = Factory.getMany({ Model: CareerPathModel });
export const updateCareerPath = Factory.updateOne({ Model: CareerPathModel });

// Question Response Rules
export const createCareerPathResponseAndWeight = Factory.createOne({
  Model: CareerPathResponseAndWeightModel,
});
export const createManyCareerPathResponseAndWeight = Factory.createMany({
  Model: CareerPathResponseAndWeightModel,
});
export const getOneCareerPathResponseAndWeight = Factory.getOne(
  CareerPathResponseAndWeightModel,
);
export const getAllCareerPathResponseAndWeights = Factory.getMany({
  Model: CareerPathResponseAndWeightModel,
});

// Interests
export const createInterest = Factory.createOne({ Model: InterestModel });
export const createManyInterests = Factory.createMany({ Model: InterestModel });
export const getOneInterest = Factory.getOne(InterestModel);
export const getAllInterests = Factory.getMany({ Model: InterestModel });

// Skills
export const createSkill = Factory.createOne({ Model: SkillModel });
export const createManySkills = Factory.createMany({ Model: SkillModel });
export const getOneSkill = Factory.getOne(SkillModel);
export const getAllSkills = Factory.getMany({ Model: SkillModel });

// Job Roles
export const createJobRole = Factory.createOne({ Model: JobRoleModel });
export const createManyJobRoles = Factory.createMany({ Model: JobRoleModel });
export const getOneJobRole = Factory.getOne(JobRoleModel);
export const getAllJobRoles = Factory.getMany({ Model: JobRoleModel });

// User Profile
export const createProfile = Factory.createOne({ Model: UserProfileModel });
