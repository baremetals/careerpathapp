import { IUserCareerPathDocument } from 'interfaces/userProfile';
import { ERROR_MESSAGES } from '../../lib/error-messages';
import { CareerPathModel } from '../../models/CareerPath';
import { JobRoleModel } from '../../models/JobRole';
import AppError from '../../utils/appError';

export default async function findCareerPathsAndRoles(
  careerPathDoc: IUserCareerPathDocument,
) {
  try {
    const jobRoleDocs = await JobRoleModel.find({
      _id: { $in: careerPathDoc.jobs },
    });

    if (!jobRoleDocs)
      throw new AppError(
        ERROR_MESSAGES.CAREER_PATH.ISSUE_SAVING_RESPONSES,
        401,
      );

    const careerPathDocs = await CareerPathModel.find({
      _id: { $in: careerPathDoc.paths },
    });

    if (!careerPathDocs)
      throw new AppError(
        ERROR_MESSAGES.CAREER_PATH.ISSUE_SAVING_RESPONSES,
        401,
      );

    return {
      jobRoleDocs,
      careerPathDocs,
    };
  } catch (error) {
    console.log(error);
    throw new AppError(ERROR_MESSAGES.CAREER_PATH.ISSUE_SAVING_RESPONSES, 400);
  }
}
