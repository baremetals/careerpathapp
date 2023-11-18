import { Request } from 'express';
import { IShared } from 'interfaces';
import { Schema } from 'mongoose';
import {
  ICareerGoalDocument,
  ICertificationDocument,
  IEducationDocument,
  IExperienceDocument,
  IInterestDocument,
  ISuitabilityScoreDocument,
  ISkillDocument,
  IUserCareerPathDocument,
} from '../userProfile';

export interface IUserDocument extends IShared {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar: string;
  bio: string;
  isDisabled: boolean;
  isActive: boolean;
  role: string;
  profileId: IUserProfileDocument;
  passwordChangedAt: number;
  correctPassword: (enteredPassword: string, hashedPassword: string) => boolean;
}

type TResponseType = {
  questionId: Schema.Types.ObjectId;
  questionVersion: number;
  responseId: Schema.Types.ObjectId;
  responseOption: string;
};

export interface IUserQuestionResponseDocument extends IShared {
  profileId: Schema.Types.ObjectId;
  selectedIndustries: Array<string>;
  selectedInterests: Array<string>;
  responses: Array<TResponseType>;
}

export interface IUserProfileDocument extends IShared {
  userId: Schema.Types.ObjectId;
  skills: Array<ISkillDocument>;
  education: Array<IEducationDocument>;
  experience: Array<IExperienceDocument>;
  careerGoals: Array<ICareerGoalDocument>;
  certifications?: Array<ICertificationDocument>;
  interests?: Array<IInterestDocument>;
  preferredWorkEnvironment?: string;
  careerPaths: Array<IUserCareerPathDocument>;
  suitabilityScores: Array<ISuitabilityScoreDocument>;
}

export interface AuthenticatedRequest extends Request {
  user: IUserDocument;
}
