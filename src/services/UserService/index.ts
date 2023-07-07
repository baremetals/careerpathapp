import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { IUserProfileDocument } from '../../interfaces/user';
import { UserProfileModel } from '../../models/UserProfile';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';

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
  catchAsync(async (req: Request, next: NextFunction) => {
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

const createUserInitialProfile = async (userId: string) => {
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
    preferredWorkEnvironments: undefined,
  });
};

export {
  createSkillOrInterest,
  createUserInitialProfile,
  updateUserProfile,
  updateUserSkillOrInterest,
};
