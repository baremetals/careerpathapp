import { IShared } from '@/interfaces';

export interface ICourseDocument extends IShared {
  title: string;
  description: string;
  providerName: string;
  providerLogo: string;
  educationRequirements: string[];
  industry: string[];
  careerPath: string[];
  jobRole: string[];
}
