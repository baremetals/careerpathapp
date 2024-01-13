// import { Request } from 'express'
import { IShared } from '@/interfaces';

export interface IUserDocument extends IShared {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar: string;
  bio: string;
  status: string;
  role: string;
  // profileId: mongoose.Types.ObjectId;
  profileId: string;
  passwordChangedAt: number;
  correctPassword: (enteredPassword: string, hashedPassword: string) => boolean;
}

export interface IUserProfileDocument extends IShared {
  userId: string;
  skills: Array<string>;
  education: Array<string>;
  experience: Array<string>;
  careerGoals: Array<string>;
  certifications?: Array<string>;
  preferredWorkEnvironment?: string;
  careerPaths: Array<string>;
  suitabilityScoresId: string;
  questionsResponsesId: string;
}

export class SanitizedUser {
  id: string;
  createdAt: number;
  role: string;
  status: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar: string;
  bio: string;
  profileId: string;
  updatedAt: number;

  constructor(user: IUserDocument) {
    this.id = user._id;
    this.createdAt = +user.createdAt;
    this.updatedAt = +user.updatedAt;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.fullName = user.fullName;
    this.email = user.email;
    this.role = user.role;
    this.avatar = user.avatar;
    this.status = user.status;
    this.profileId = user.profileId;
    this.bio = user.bio;
  }
}
