import * as argon2 from 'argon2';
import { NextFunction, Request, Response } from 'express';
// import multer from 'multer';
import { getSignedFileUrl, uploadFile } from '../../lib/fileUpload';
import { CertificationModel } from '../../models/Certification';
import { EducationModel } from '../../models/Education';
import { ExperienceModel } from '../../models/Experience';
import { InterestModel } from '../../models/Interest';
import { QuestionModel } from '../../models/Question';
import { SkillModel } from '../../models/Skill';
import { UserModel } from '../../models/User';
import { UserProfileModel } from '../../models/UserProfile';
import { EmailService } from '../../services/EmailService';
import * as Factory from '../../services/SharedService';
import {
  // createCareerPathService,
  createSkillOrInterest,
  updateUserSkillOrInterest,
} from '../../services/UserService';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';
import // fetchCareerPathRoles,

// getUserResponse,
// straverseDecisionTree,
'../../utils/questionResponse';

const updateAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('========> upload', req.file);
  try {
    const file: Express.Multer.File = req.file as Express.Multer.File;
    if (!file.mimetype.startsWith('image')) {
      return next(
        new AppError('Not an image! Please upload only images.', 400),
      );
    }
    if (file.size > 1069736) {
      return next(
        new AppError(
          'Image too large please upload a smaller size than 1069736',
          400,
        ),
      );
    }
    const response = await uploadFile(
      file.originalname as string,
      file.buffer as Buffer,
      file.mimetype,
    );
    const fileUrl = await getSignedFileUrl(response, 3600);
    // console.log('================================>', fileUrl);
    res.status(200).json({
      status: 'success',
      message: 'Avatar updated',
      data: { url: fileUrl },
    });
  } catch (err) {
    console.log('=============><==============', err);
    return next(new AppError('Upload failed', 400));
  }
};

const getMe = (req: Request, _res: Response, next: NextFunction) => {
  req.params.id = req.session.userId;
  next();
};

const changePassword = catchAsync(async (req, res, next) => {
  const user = await UserModel.findById(req.session.userId).select('+password');
  // console.log(req.body.currentPassword);

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  if (!(await argon2.verify(user.password, req.body.currentPassword))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  user.password = req.body.newPassword;
  user.confirmPassword = req.body.confirmPassword;
  user.lastModifiedBy = user.fullName;
  user.lastModifiedAt = new Date();
  await user.save();

  await new EmailService(user).sendPasswordChangeEmail();

  res.status(201).json({
    status: 'success',
    message: 'Your password has been changed',
  });
});

const updateMe = Factory.updateOne(UserModel);

const deleteMe = catchAsync(async (req, res, next) => {
  const user = await UserModel.findById(req.session.userId).select(
    '+isDisabled',
  );
  // console.log(req.body.currentPassword);
  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  user.isDisabled = true;
  user.lastModifiedBy = user.fullName;
  user.lastModifiedAt = new Date();
  await user.save({ validateBeforeSave: false });

  res.status(201).json({
    status: 'success',
    message: 'Your password has been changed',
  });
});

const generateCareerPath = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // console.log('==============>: the user id', req.session.userId);

      const questions = await QuestionModel.find({})
        .sort({ order: 'asc' })
        .exec();

      if (req.body.responses.length !== questions.length) {
        throw next(
          new AppError('Please provide a response for all questions', 400),
        );
      }
      // const data = await traverseDecisionTree(
      //   // req.session.userId,
      //   req.body.selectedIndustries,
      //   questions,
      //   next,
      //   req.body.responses,
      // );

      // const careerPaths = await fetchCareerPathRoles(data);

      // console.log('==============>: career paths my dude', careerPaths);

      return;

      // res.status(201).json({
      //   status: 'success',
      //   data: careerPaths,
      // });
    } catch (err) {
      throw next(
        new AppError(
          'Your account has been deactivated. Please reactivate your account',
          400,
        ),
      );
    }
  },
);

const getUserWithProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.session.userId;

    // Retrieve the user
    const user = await UserModel.findById(userId);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Retrieve the user profile
    const userProfile = await UserProfileModel.findOne({ user: userId });

    if (!userProfile) {
      return next(new AppError('User profile not found', 404));
    }

    const assembledData = {
      user: {
        id: user._id,
        email: user.email,
      },
      userProfile: {
        skills: userProfile.skills,
        education: userProfile.education,
        experience: userProfile.experience,
        careerGoals: userProfile.careerGoals,
        certifications: userProfile.certifications,
        interests: userProfile.interests,
        careerPaths: userProfile.careerPaths,
        preferredWorkEnvironments: userProfile.preferredWorkEnvironment,
      },
    };

    res.json(assembledData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUser = Factory.getOne(UserModel);

// User Profile
const createExperience = Factory.createOne(ExperienceModel);
const createEducation = Factory.createOne(EducationModel);
const createCertification = Factory.createOne(CertificationModel);

const updateProfile = Factory.updateOne(UserProfileModel);
const updateExperience = Factory.updateOne(ExperienceModel);
const updateEducation = Factory.updateOne(EducationModel);
const updateCertification = Factory.updateOne(CertificationModel);

const deleteExperience = Factory.deleteOne(ExperienceModel);
const deleteEducation = Factory.deleteOne(EducationModel);
const deleteCertification = Factory.deleteOne(CertificationModel);

const createSkill = createSkillOrInterest(SkillModel);
const createInterest = createSkillOrInterest(InterestModel);

const updateMySkillOrInterest = updateUserSkillOrInterest(UserProfileModel);

export {
  changePassword,
  createCertification,
  createEducation,
  createExperience,
  createInterest,
  createSkill,
  deleteCertification,
  deleteEducation,
  deleteExperience,
  deleteMe,
  generateCareerPath,
  getMe,
  getUser,
  getUserWithProfile,
  updateAvatar,
  updateCertification,
  updateEducation,
  updateExperience,
  updateMe,
  updateMySkillOrInterest,
  updateProfile,
};
