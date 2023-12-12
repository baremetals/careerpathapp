import { Schema } from 'mongoose';

export type TRolesAndIndustries = {
  role_id: Schema.Types.ObjectId;
  industries: Array<Schema.Types.ObjectId>;
};

export interface ICareersAndRolesReturnType {
  //   errors: any;
  job_roles: TRolesAndIndustries[];
}

export function extractObjectIds<T extends Record<string, any>>(
  arrayOfObjects: T[],
  key: keyof T,
): Schema.Types.ObjectId[] {
  return arrayOfObjects.map((obj) => obj[key]);
}
