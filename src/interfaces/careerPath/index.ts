import { IShared } from '@/interfaces';

interface IIndustryDocument extends IShared {
  name: string;
  description: string;
  careerPaths: Array<string>;
}

interface ICareerPathDocument extends IShared {
  title: string;
  description: string;
  requiredWeight: number;
  industries: Array<string>;
}

interface IJobRoleDocument extends IShared {
  title: string;
  description: string;
  averageStartingSalary: number | string;
  averageExperiencedSalary: number | string;
  educationRequirements: string[];
  skills: string[];
  careerPath: string;
  progressPaths: string[];
  relatedCareers: string[];
  aliasTitles: string[];
  requiredWeight: number | string;
}

export { IIndustryDocument, ICareerPathDocument, IJobRoleDocument };
