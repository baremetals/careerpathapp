import mongoose, { Schema, model } from 'mongoose';
import { IUserProfileDocument } from '@/interfaces/user';

const userProfileSchema = new Schema<IUserProfileDocument>({
  userId: {
    // type: mongoose.Types.ObjectId,
    type: String,
    ref: 'User',
    required: true,
    unique: true,
  },
  skills: [{ type: mongoose.Types.ObjectId, ref: 'Skill', required: false }],
  education: [
    { type: mongoose.Types.ObjectId, ref: 'Education', required: false },
  ],
  experience: [
    { type: mongoose.Types.ObjectId, ref: 'Experience', required: false },
  ],
  careerGoals: [
    { type: mongoose.Types.ObjectId, ref: 'CareerGoal', required: false },
  ],
  certifications: [
    { type: mongoose.Types.ObjectId, ref: 'Certification', required: false },
  ],
  preferredWorkEnvironment: {
    type: String,
    required: false,
  },
  careerPaths: {
    // type: [mongoose.Types.ObjectId],
    type: [String],
    ref: 'UserCareerPath',
    required: false,
  },
  suitabilityScoresId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SuitabilityScores',
    required: false,
  },
  questionsResponsesId: {
    type: mongoose.Schema.Types.ObjectId,
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
