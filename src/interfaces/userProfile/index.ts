import { IShared } from '@/interfaces';

interface IEducationDocument extends IShared {
  user: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate: Date;
}

interface IExperienceDocument extends IShared {
  user: string;
  company: string;
  position: string;
  employmentPeriod: {
    startDate: Date;
    endDate: Date;
  };
  responsibilities: string;
}

interface ICertificationDocument extends IShared {
  user: string;
  certificationBody: string;
  certificationName: string;
  certificationDate: Date;
  description: string;
}

interface IInterestDocument extends IShared {
  name: string;
  type: string;
  relatedCareerPaths: Array<string>;
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
  profileId: string;
  chosenIndustriesAndScores: Array<TSuitabilityScoreType>;
  industriesAndScores: Array<TSuitabilityScoreType>;
}

interface IUserCareerPathDocument extends IShared {
  profileId: string;
  paths: Array<string>;
  jobs: Array<string>;
}

interface IUserQuestionResponseDocument extends IShared {
  profileId: string;
  selectedIndustries: Array<string>;
  selectedInterests: Array<string>;
  responses: Array<TResponseType>;
}
export type TResponseType = {
  questionId: string;
  questionNumber: number;
  questionVersion: number;
  responseId: string;
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
