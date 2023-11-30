import { Schema, model } from 'mongoose';
import { IUserProfileDocument } from '../../interfaces/user';

const userProfileSchema = new Schema<IUserProfileDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  skills: [{ type: Schema.Types.ObjectId, ref: 'Skill', required: false }],
  education: [
    { type: Schema.Types.ObjectId, ref: 'Education', required: false },
  ],
  experience: [
    { type: Schema.Types.ObjectId, ref: 'Experience', required: false },
  ],
  careerGoals: [
    { type: Schema.Types.ObjectId, ref: 'CareerGoal', required: false },
  ],
  certifications: [
    { type: Schema.Types.ObjectId, ref: 'Certification', required: false },
  ],
  preferredWorkEnvironment: {
    type: String,
    required: false,
  },
  careerPaths: {
    type: [Schema.Types.ObjectId],
    ref: 'UserCareerPath',
    required: false,
  },
  suitabilityScoresId: {
    type: Schema.Types.ObjectId,
    ref: 'SuitabilityScores',
    required: false,
  },
  questionsResponsesId: {
    type: Schema.Types.ObjectId,
    ref: 'QuestionResponses',
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  lastModifiedAt: {
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
