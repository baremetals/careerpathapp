import { Schema } from 'mongoose';
import { TRolesAndIndustries, extractObjectIds } from '.';
import { ERROR_MESSAGES } from '@/lib/error-messages';
import { JobRoleModel } from '@/models/JobRole';
import { UserCareerPathModel } from '@/models/UserCareerPath';
import { UserProfileModel } from '@/models/UserProfile';
import AppError from '@/utils/appError';

type TSaveCareerPathsAndRoles = {
  roles: TRolesAndIndustries[];
  profileId: Schema.Types.ObjectId;
  userName: string;
};
export default async function saveCareerPathsAndRoles({
  roles,
  profileId,
  userName,
}: TSaveCareerPathsAndRoles) {
  try {
    // const role_Ids: Array<Schema.Types.ObjectId> = roles.map(role => role.role_id);
    const role_Ids = extractObjectIds(roles, 'role_id');
    const jobRoles = await JobRoleModel.find({ _id: { $in: role_Ids } });

    if (!jobRoles)
      throw new AppError(
        ERROR_MESSAGES.CAREER_PATH.ISSUE_SAVING_RESPONSES,
        401,
      );

    const careerPaths = extractObjectIds(jobRoles, 'careerPath');

    const careerPathsDoc = await UserCareerPathModel.create({
      profileId,
      paths: careerPaths,
      jobs: jobRoles,
    });
    console.log(
      'The User Name-------------------------<',
      //   industries,
    );

    if (!careerPathsDoc)
      throw new AppError(
        ERROR_MESSAGES.CAREER_PATH.ISSUE_SAVING_RESPONSES,
        401,
      );

    const userProfile = await UserProfileModel.findById(profileId);

    if (userProfile) {
      userProfile.careerPaths = careerPathsDoc._id;
      userProfile.lastModifiedAt = new Date();
      userProfile.lastModifiedBy = userName;
      userProfile.save({ validateBeforeSave: false });
    }

    return careerPathsDoc;
  } catch (error) {
    console.log(error);
    throw new AppError(ERROR_MESSAGES.CAREER_PATH.ISSUE_SAVING_RESPONSES, 400);
  }
}
