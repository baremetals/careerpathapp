import { NextFunction, Request, Response } from 'express';
import Factory from '@/factory';
import { CertificationModel } from '@/models/Certification';
import { EducationModel } from '@/models/Education';
import { ExperienceModel } from '@/models/Experience';
import { InterestModel } from '@/models/Interest';
import { QuestionModel } from '@/models/Question';
import { SkillModel } from '@/models/Skill';
import { UserModel } from '@/models/User';
import { UserProfileModel } from '@/models/UserProfile';
import {
  // createCareerPathService,
  createSkillOrInterest,
  updateUserSkillOrInterest,
} from '@/services/UserService';
import AppError from '@/utils/appError';
import catchAsync from '@/utils/catchAsync';
import // fetchCareerPathRoles,

// getUserResponse,
// straverseDecisionTree,
'@/utils/questionResponse';

const updateMeHandler = Factory.updateOne(UserModel);

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
  createCertification,
  createEducation,
  createExperience,
  createInterest,
  createSkill,
  deleteCertification,
  deleteEducation,
  deleteExperience,
  generateCareerPath,
  getUserWithProfile,
  updateCertification,
  updateEducation,
  updateExperience,
  updateMeHandler,
  updateMySkillOrInterest,
  updateProfile,
};
