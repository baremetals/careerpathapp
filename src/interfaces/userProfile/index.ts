import { IShared } from 'interfaces';
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
  relatedCareerPaths: Array<Schema.Types.ObjectId>;
}

interface IWorkEnvironmentDocument extends IShared {
  name: string;
}

interface ICareerGoalDocument extends IShared {
  name: string;
}

export {
  IInterestDocument,
  ICertificationDocument,
  IEducationDocument,
  IExperienceDocument,
  IWorkEnvironmentDocument,
  ISkillDocument,
  ICareerGoalDocument,
};
