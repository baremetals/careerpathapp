import AppError from '@/utils/appError';
import { UserProfileModel } from '../models/UserProfile';
import { HTTP_STATUS_CODES } from '@/lib/status-codes';
import { IUserProfileDocument } from '@/interfaces/user';

export class ProfileRepo {
  async createProfile(userId: string, fullName: string) {
    return this.createUserInitialProfile(userId, fullName);
  }
  private async createUserInitialProfile(userId: string, fullName: string) {
    try {
      return await UserProfileModel.create({
        userId,
        skills: [],
        education: [],
        experience: [],
        careerGoals: [],
        certifications: [],
        interests: [],
        careerPaths: [],
        preferredWorkEnvironments: 'hybrid',
        suitabilityScores: [],
        createdBy: fullName,
        lastModifiedBy: fullName,
      });
    } catch (error) {
      console.error(
        `Failed to create user profile for user ${userId}: ${error}`,
      );
      throw new AppError(
        'Failed to create user profile',
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findOne(query: object) {
    return UserProfileModel.findOne(query);
  }
  async findById(id: string, query: string | Array<string> = '') {
    return UserProfileModel.findById(id).populate(query);
  }

  async save(user: IUserProfileDocument, validate = false) {
    return await UserProfileModel.updateOne({ _id: user._id }, user, {
      validateBeforeSave: validate,
    });
  }
}
