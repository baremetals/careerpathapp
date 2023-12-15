import { UserProfileModel } from '../models/UserProfile';

export class ProfileRepo {
  async createProfile(userId: string, fullName: string) {
    return this.createUserInitialProfile(userId, fullName);
  }
  private createUserInitialProfile = async (
    userId: string,
    fullName: string,
  ) => {
    return UserProfileModel.create({
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
  };
}
