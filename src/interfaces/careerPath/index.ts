import { Schema } from 'mongoose';
import { IShared } from 'interfaces';

interface IIndustryDocument extends IShared {
  name: string;
  description: string;
  careerPaths: Array<Schema.Types.ObjectId>;
}

interface ICareerPathDocument extends IShared {
  title: string;
  description: string;
  industries: Array<Schema.Types.ObjectId>;
}

type requiredResponses = {
  question: Schema.Types.ObjectId;
  response: string;
};

interface IJobRoleDocument extends IShared {
  title: string;
  description: string;
  averageStartingSalary: number;
  averageExperiencedSalary: number;
  educationRequirements: string[];
  skills: string[];
  careerPath: Schema.Types.ObjectId;
  progressPaths: string[];
  relatedCareers: string[];
  aliasTitles: string[];
  requiredResponses: requiredResponses[];
}

export { IIndustryDocument, ICareerPathDocument, IJobRoleDocument };