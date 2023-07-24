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
  requiredWeight: number;
  industries: Array<Schema.Types.ObjectId>;
}

// type requiredResponses = {
//   question: Schema.Types.ObjectId;
//   response: string | string[];
// };

interface IJobRoleDocument extends IShared {
  title: string;
  description: string;
  averageStartingSalary: number | string;
  averageExperiencedSalary: number | string;
  educationRequirements: string[];
  skills: string[];
  careerPath: Schema.Types.ObjectId;
  progressPaths: string[];
  relatedCareers: string[];
  aliasTitles: string[];
  requiredWeight: number | string;
}

export { IIndustryDocument, ICareerPathDocument, IJobRoleDocument };
