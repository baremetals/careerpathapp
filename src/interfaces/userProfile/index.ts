import { IShared } from '@/interfaces';
import { Schema } from 'mongoose';

interface IEducationDocument extends IShared {
  user: Schema.Types.ObjectId;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate: Date;
}

interface IExperienceDocument extends IShared {
  user: Schema.Types.ObjectId;
  company: string;
  position: string;
  employmentPeriod: {
    startDate: Date;
    endDate: Date;
  };
  responsibilities: string;
}

interface ICertificationDocument extends IShared {
  user: Schema.Types.ObjectId;
  certificationBody: string;
  certificationName: string;
  certificationDate: Date;
  description: string;
}

interface IInterestDocument extends IShared {
  name: string;
  type: string;
  relatedCareerPaths: Array<Schema.Types.ObjectId>;
}

interface ISkillDocument extends IShared {
  name: string;
}

interface IWorkEnvironmentDocument extends IShared {
  name: string;
}

interface ICareerGoalDocument extends IShared {
  name: string;
}
interface ISuitabilityScoreDocument extends IShared {
  profileId: Schema.Types.ObjectId;
  chosenIndustriesAndScores: Array<TSuitabilityScoreType>;
  industriesAndScores: Array<TSuitabilityScoreType>;
}

interface IUserCareerPathDocument extends IShared {
  profileId: Schema.Types.ObjectId;
  // industries: Array<Schema.Types.ObjectId>;
  paths: Array<Schema.Types.ObjectId>;
  jobs: Array<Schema.Types.ObjectId>;
}

interface IUserQuestionResponseDocument extends IShared {
  profileId: Schema.Types.ObjectId;
  selectedIndustries: Array<string>;
  selectedInterests: Array<string>;
  responses: Array<TResponseType>;
}
export type TResponseType = {
  questionId: Schema.Types.ObjectId;
  questionNumber: number;
  questionVersion: number;
  responseId: Schema.Types.ObjectId;
  responseToQuestion: string;
};

export type TSuitabilityScoreType = {
  industryName: string;
  industryId: string;
  score: number;
};

export {
  ICareerGoalDocument,
  ICertificationDocument,
  IEducationDocument,
  IExperienceDocument,
  IInterestDocument,
  ISkillDocument,
  ISuitabilityScoreDocument,
  IUserCareerPathDocument,
  IUserQuestionResponseDocument,
  IWorkEnvironmentDocument,
};
