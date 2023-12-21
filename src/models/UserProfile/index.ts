import { Schema, model } from 'mongoose';
import { IUserProfileDocument } from '@/interfaces/user';

const userProfileSchema = new Schema<IUserProfileDocument>({
  userId: {
    type: String,
    ref: 'User',
    required: true,
    unique: true,
  },
  skills: [{ type: String, ref: 'Skill', required: false }],
  education: [{ type: String, ref: 'Education', required: false }],
  experience: [{ type: String, ref: 'Experience', required: false }],
  careerGoals: [{ type: String, ref: 'CareerGoal', required: false }],
  certifications: [{ type: String, ref: 'Certification', required: false }],
  preferredWorkEnvironment: {
    type: String,
    required: false,
  },
  careerPaths: {
    type: [String],
    ref: 'UserCareerPath',
    required: false,
  },
  suitabilityScoresId: {
    type: String,
    ref: 'SuitabilityScores',
    required: false,
  },
  questionsResponsesId: {
    type: String,
    ref: 'QuestionResponses',
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  createdBy: { type: String, default: 'admin', select: false },
  lastModifiedBy: { type: String, default: 'admin', select: false },
});

const UserProfileModel = model<IUserProfileDocument>(
  'UserProfile',
  userProfileSchema,
);

export { UserProfileModel };
