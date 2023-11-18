import { Schema, model } from 'mongoose';
import { IUserProfileDocument } from '../../interfaces/user';

const userProfileSchema = new Schema<IUserProfileDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  skills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
  education: [{ type: Schema.Types.ObjectId, ref: 'Education' }],
  experience: [{ type: Schema.Types.ObjectId, ref: 'Experience' }],
  careerGoals: [{ type: Schema.Types.ObjectId, ref: 'CareerGoal' }],
  certifications: [{ type: Schema.Types.ObjectId, ref: 'Certification' }],
  preferredWorkEnvironment: {
    type: String,
    required: false,
  },
  interests: { type: [Schema.Types.ObjectId], ref: 'Interest' },
  careerPaths: { type: [Schema.Types.ObjectId], ref: 'UserCareerPath' },
  suitabilityScores: [
    {
      industryName: { type: String, required: true },
      industryId: { type: Schema.Types.ObjectId, required: true },
      score: { type: Number, required: true },
    },
  ],
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
