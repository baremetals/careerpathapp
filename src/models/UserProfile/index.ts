import { Schema, model } from 'mongoose';
import { IUserProfileDocument } from '../../interfaces/user';

const userProfileSchema = new Schema<IUserProfileDocument>({
  skills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
  education: [{ type: Schema.Types.ObjectId, ref: 'Education' }],
  experience: [{ type: Schema.Types.ObjectId, ref: 'Experience' }],
  careerGoals: [{ type: Schema.Types.ObjectId, ref: 'CareerGoal' }],
  certifications: [{ type: Schema.Types.ObjectId, ref: 'Certification' }],
  preferredWorkEnvironments: {
    type: Schema.Types.ObjectId,
    ref: 'PreferredWorkEnvironment',
  } || undefined,
  selectedIndustries: { type: [Schema.Types.ObjectId], ref: 'Industry' },
  interests: { type: [Schema.Types.ObjectId], ref: 'Interest' },

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
