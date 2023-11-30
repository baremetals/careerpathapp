// import { NextFunction, Request, Response } from 'express';
// import catchAsync from '../../utils/catchAsync';
import Factory from '../../factory/';
import { CareerPathModel } from '../../models/CareerPath';
import { CareerPathResponseAndWeightModel } from '../../models/CareerPathResponseAndWeight';
import { IndustryModel } from '../../models/Industry';
import { InterestModel } from '../../models/Interest';
import { JobRoleModel } from '../../models/JobRole';
import { QuestionModel } from '../../models/Question';
import { SkillModel } from '../../models/Skill';
import { UserProfileModel } from '../../models/UserProfile';
import { saveQuestionsAndResponses } from '../../services/AdminServices';

// Questions
export const createQuestion = Factory.createOne(QuestionModel);
// export const createManyQuestions = Factory.createMany(QuestionModel);
export const createManyQuestions = saveQuestionsAndResponses();
export const getOneQuestion = Factory.getOne(QuestionModel);
export const getAllQuestions = Factory.getMany(QuestionModel);
export const updateManyQuestions = Factory.updateMany(QuestionModel);

// Industries
export const createIndustry = Factory.createOne(IndustryModel);
export const createManyIndustries = Factory.createMany(IndustryModel);
export const getOneIndustry = Factory.getOne(IndustryModel);
export const getAllIndustries = Factory.getMany(IndustryModel);

// career Paths
export const createCareerPath = Factory.createOne(CareerPathModel);
export const createManyCareerPaths = Factory.createMany(CareerPathModel);
export const getOneCareerPath = Factory.getOne(CareerPathModel);
export const getAllCareerPaths = Factory.getMany(CareerPathModel);
export const updateCareerPath = Factory.updateOne(CareerPathModel);

// Question Response Rules
export const createCareerPathResponseAndWeight = Factory.createOne(
  CareerPathResponseAndWeightModel,
);
export const createManyCareerPathResponseAndWeight = Factory.createMany(
  CareerPathResponseAndWeightModel,
);
export const getOneCareerPathResponseAndWeight = Factory.getOne(
  CareerPathResponseAndWeightModel,
);
export const getAllCareerPathResponseAndWeights = Factory.getMany(
  CareerPathResponseAndWeightModel,
);

// Interests
export const createInterest = Factory.createOne(InterestModel);
export const createManyInterests = Factory.createMany(InterestModel);
export const getOneInterest = Factory.getOne(InterestModel);
export const getAllInterests = Factory.getMany(InterestModel);

// Skills
export const createSkill = Factory.createOne(SkillModel);
export const createManySkills = Factory.createMany(SkillModel);
export const getOneSkill = Factory.getOne(SkillModel);
export const getAllSkills = Factory.getMany(SkillModel);

// Job Roles
export const createJobRole = Factory.createOne(JobRoleModel);
export const createManyJobRoles = Factory.createMany(JobRoleModel);
export const getOneJobRole = Factory.getOne(JobRoleModel);
export const getAllJobRoles = Factory.getMany(JobRoleModel);

// User Profile
export const createProfile = Factory.createOne(UserProfileModel);
