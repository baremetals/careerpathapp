// import { NextFunction, Request, Response } from 'express';
// import catchAsync from '../../utils/catchAsync';
import { InterestModel } from '../../models/Interest';
import { CareerPathModel } from '../../models/CareerPath';
import { DecisionTreeRuleModel } from '../../models/DecisionTreeRule';
import { IndustryModel } from '../../models/Industry';
import { QuestionModel } from '../../models/Question';
import * as Factory from '../../services/SharedService';
import { SkillModel } from '../../models/Skill';
import { JobRoleModel } from '../../models/JobRole';

// Questions
export const createQuestion = Factory.createOne(QuestionModel);
export const createManyQuestions = Factory.createMany(QuestionModel);
export const getOneQuestion = Factory.getOne(QuestionModel);
export const getAllQuestions = Factory.getMany(QuestionModel);

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

// Question Response Rules
export const createDecisionTreeRule = Factory.createOne(DecisionTreeRuleModel);
export const createManyDecisionTreeRules = Factory.createMany(
  DecisionTreeRuleModel,
);
export const getOneDecisionTreeRule = Factory.getOne(DecisionTreeRuleModel);
export const getAllDecisionTreeRules = Factory.getMany(DecisionTreeRuleModel);

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
