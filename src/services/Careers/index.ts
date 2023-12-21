export type TRolesAndIndustries = {
  role_id: string;
  industries: Array<string>;
};

export interface ICareersAndRolesReturnType {
  //   errors: any;
  job_roles: TRolesAndIndustries[];
}

export function extractObjectIds<T extends Record<string, any>>(
  arrayOfObjects: T[],
  key: keyof T,
): string[] {
  return arrayOfObjects.map((obj) => obj[key]);
}
