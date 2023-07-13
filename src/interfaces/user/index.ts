import { Request } from 'express';
import { IShared } from 'interfaces';
import { Schema } from 'mongoose';
import {
  ICareerGoalDocument,
  ICertificationDocument,
  IEducationDocument,
  IExperienceDocument,
  IInterestDocument,
  IWorkEnvironmentDocument,
  ISkillDocument,
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
  profile: IUserProfileDocument;
  passwordChangedAt: number;
  correctPassword: (enteredPassword: string, hashedPassword: string) => boolean;
}

export interface IUserProfileDocument extends IShared {
  user: Schema.Types.ObjectId;
  skills: ISkillDocument[];
  education: IEducationDocument[];
  experience: IExperienceDocument[];
  careerGoals: ICareerGoalDocument[];
  selectedIndustries: Array<Schema.Types.ObjectId>;
  certifications?: ICertificationDocument[];
  interests?: IInterestDocument[];
  preferredWorkEnvironments?: IWorkEnvironmentDocument;
}

export interface AuthenticatedRequest extends Request {
  user: IUserDocument;
}
