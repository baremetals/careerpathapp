import { NextFunction, Request, Response } from 'express';
import { ICareerPathDocument, IJobRoleDocument } from 'interfaces/careerPath';
import { Model } from 'mongoose';
import { IUserProfileDocument } from '../../interfaces/user';
import { UserModel } from '../../models/User';
import { UserCareerPathModel } from '../../models/UserCareerPath';
import { UserProfileModel } from '../../models/UserProfile';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';

// const createUserService = (Model: Model<any>) =>
//   catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
//     const response = await Model.create(req.body);
//     next(response);
//   });

const updateUserProfile = async (
  body: Partial<IUserProfileDocument>,
  objectId: string,
  next: NextFunction,
) => {
  // console.log(body);
  try {
    const query = UserProfileModel.findByIdAndUpdate(
      objectId,
      { ...body, lastModifiedAt: Date.now() },
      {
        new: true,
        runValidators: true,
      },
    );

    const doc = await query.exec();

    if (!doc) {
      return next(new AppError('No document found', 404));
    }
    return;
  } catch (err) {
    console.group('================>the error:', err);
    return next(new AppError('something went wrong', 401));
  }
};

const createSkillOrInterest = (Model: Model<any>) =>
  catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    const response = await Model.create(req.body);
    next(response);
  });

const updateUserSkillOrInterest = (Model: Model<any>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = Model.findByIdAndUpdate(
      req.body.objectId,
      { ...req.body, lastModifiedAt: Date.now() },
      {
        new: true,
        runValidators: true,
      },
    );

    const doc = await query.exec();

    if (!doc) {
      return next(new AppError('No document found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

const createUserInitialProfile = async (userId: string, fullName: string) => {
  // Todo use try catch to cath the errors
  return UserProfileModel.create({
    user: userId,
    skills: [],
    education: [],
    experience: [],
    careerGoals: [],
    selectedIndustries: [],
    certifications: [],
    interests: [],
    careerPaths: [],
    preferredWorkEnvironments: undefined,
    createdBy: fullName,
    lastModifiedBy: fullName,
  });
};

/**
 * Store career path data in the user profile
 * @param careerPaths
 * @returns
 */

type TCareerPaths = {
  industry: string;
  paths: ICareerPathDocument[];
  jobs: IJobRoleDocument[];
}[];

const createCareerPathService = (careerPaths: TCareerPaths) =>
  catchAsync(async (req: Request, res: Response) => {
    const user = await UserModel.findById(req.session.userId).select(
      '+_id +fullName +profile',
    );
    const careerPathDocuments = careerPaths.map((path) => ({
      user: user?.profile, //new Types.ObjectId(user.profile),
      industry: path.industry,
      paths: path.paths.map((obj) => obj),
      jobs: path.jobs.map((obj) => obj),
      createdBy: user?.fullName,
      lastModifiedBy: user?.fullName,
    }));
    const insertedDocuments = await UserCareerPathModel.insertMany(
      careerPathDocuments,
    );

    const insertedIds = insertedDocuments.map((result) => result._id);

    await UserProfileModel.findByIdAndUpdate(user?.profile.toString(), {
      selectedIndustries: req.body.selectedIndustries,
      skills: req.body.selectedSkills,
      careerPaths: insertedIds,
      lastModifiedBy: user?.fullName,
      lastModifiedAt: Date.now(),
    });

    res.status(201).json({
      status: 'success',
      data: careerPaths,
    });
  });

export {
  createCareerPathService,
  createSkillOrInterest,
  createUserInitialProfile,
  updateUserProfile,
  updateUserSkillOrInterest,
};
