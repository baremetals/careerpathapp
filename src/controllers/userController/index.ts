import { NextFunction, Request, Response } from 'express';
// import multer from 'multer';
import { InterestModel } from '../../models/Interest';
import { SkillModel } from '../../models/Skill';
import {
  createSkillOrInterest,
  updateUserSkillOrInterest,
} from '../../services/UserService';
import { getSignedFileUrl, uploadFile } from '../../lib/fileUpload';
import { CertificationModel } from '../../models/Certification';
import { EducationModel } from '../../models/Education';
import { ExperienceModel } from '../../models/Experience';
import { QuestionModel } from '../../models/Question';
import { QuestionResponseModel } from '../../models/QuestionResponse';
import { UserModel } from '../../models/User';
import { UserProfileModel } from '../../models/UserProfile';
import {
  createResponses,
  updateResponses,
} from '../../services/QuestionResponse';
import * as Factory from '../../services/SharedService';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';
import {
  fetchCareerPathRoles,
  getUserResponse,
  traverseDecisionTree,
} from '../../utils/questionResponse';
import { EmailService } from '../../services/EmailService';

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

export const changePassword = catchAsync(async (req, res, next) => {
  const user = await UserModel.findById(req.session.userId).select('+password');

  if (
    !user?.correctPassword(req.body.currentPassword, user.password as string)
  ) {
    return next(new AppError('Your current password is incorrect.', 401));
  }

  user.password = req.body.newPassword;
  user.confirmPassword = req.body.confirmPassword;
  user.lastModifiedBy = user.fullName;
  user.lastModifiedAt = new Date();
  await user.save({ validateBeforeSave: false });

  await new EmailService(user).sendPasswordChangeEmail();

  res.status(201).json({
    status: 'success',
    message: 'Your password has been changed',
  });
});

const updateMe = Factory.updateOne(UserModel);

const generateCareerPaths = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userResponses = await getUserResponse(req.session.userId);
    const questions = await QuestionModel.find({})
      .sort({ order: 'asc' })
      .exec();
    // const slicedQuestions = questions.slice(1, questions.length - 2)
    const data = await traverseDecisionTree(
      // req.session.userId,
      req.body.selectedIndustries,
      questions,
      next,
      userResponses,
    );

    console.log('==============>: we cooking my data!!!!', data);

    res.status(201).json({
      status: 'success',
    });
  } catch (err) {
    throw next(
      new AppError(
        'Your account has been deactivated. Please reactivate your account',
        400,
      ),
    );
  }
};

const generateCareerPath = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log('==============>: the user id', req.session.userId);
      const userResponses = await getUserResponse(req.session.userId);
      // console.log('==============>: the user responses', userResponses);
      const questions = await QuestionModel.find({})
        .sort({ order: 'asc' })
        .exec();
      // const slicedQuestions = questions.slice(1, questions.length - 2)
      const data = await traverseDecisionTree(
        // req.session.userId,
        req.body.selectedIndustries,
        questions,
        next,
        userResponses,
      );

      // console.log('==============>: we cooking my data!!!!', data);

      const careerPaths = await fetchCareerPathRoles(data, userResponses);

      console.log('==============>: career paths my dude', careerPaths);

      res.status(201).json({
        status: 'success',
        data: careerPaths,
      });
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
    const userId = req.params.userId;

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

    // Assemble the user and user profile data
    const assembledData = {
      user: {
        id: user._id,
        email: user.email,
        // Include any other relevant user fields
      },
      userProfile: {
        skills: userProfile.skills,
        education: userProfile.education,
        experience: userProfile.experience,
        careerGoals: userProfile.careerGoals,
        certifications: userProfile.certifications,
        interests: userProfile.interests,
        preferredWorkEnvironments: userProfile.preferredWorkEnvironments,
        // Include any other relevant profile fields
      },
    };

    res.json(assembledData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createQuestionResponse = createResponses(QuestionResponseModel);
const updateQuestionResponse = updateResponses(QuestionResponseModel);

const getUser = Factory.getOne(UserModel);

// User Profile
const createProfile = Factory.createOne(UserProfileModel);
const createExperience = Factory.createOne(ExperienceModel);
const createEducation = Factory.createOne(EducationModel);
const createCertification = Factory.createOne(CertificationModel);

const updateProfile = Factory.updateOne(UserProfileModel);
const updateExperience = Factory.updateOne(ExperienceModel);
const updateEducation = Factory.updateOne(EducationModel);
const updateCertification = Factory.updateOne(CertificationModel);

const deleteProfile = Factory.deleteOne(UserProfileModel);
const deleteExperience = Factory.deleteOne(ExperienceModel);
const deleteEducation = Factory.deleteOne(EducationModel);
const deleteCertification = Factory.deleteOne(CertificationModel);

const createSkill = createSkillOrInterest(SkillModel);
const createInterest = createSkillOrInterest(InterestModel);

const updateMySkillOrInterest = updateUserSkillOrInterest(UserProfileModel);

export {
  createCertification,
  createEducation,
  createExperience,
  createInterest,
  createProfile,
  createQuestionResponse,
  createSkill,
  deleteCertification,
  deleteEducation,
  deleteExperience,
  deleteProfile,
  generateCareerPath,
  generateCareerPaths,
  getMe,
  getUser,
  getUserWithProfile,
  updateAvatar,
  updateCertification,
  updateEducation,
  updateExperience,
  updateMe,
  updateProfile,
  updateQuestionResponse,
  updateMySkillOrInterest,
};
