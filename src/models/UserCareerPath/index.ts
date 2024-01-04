import { Schema, model } from 'mongoose';
import { IUserCareerPathDocument } from '@/interfaces/userProfile';

const userCareerPathSchema = new Schema<IUserCareerPathDocument>({
  profileId: { type: String, ref: 'UserProfile' },
  // industries: {
  //   type: [String],
  //   required: true,
  // },
  paths: { type: [String], ref: 'CareerPath' },
  jobs: { type: [String], ref: 'JobRole' },

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

const UserCareerPathModel = model<IUserCareerPathDocument>(
  'UserCareerPath',
  userCareerPathSchema,
);

userCareerPathSchema.index({ profileId: 1 }, { unique: true });
export { UserCareerPathModel };
