import { Schema, model } from 'mongoose';
import { IUserCareerPathDocument } from '@/interfaces/userProfile';

const userCareerPathSchema = new Schema<IUserCareerPathDocument>({
  profileId: { type: Schema.Types.ObjectId, ref: 'UserProfile' },
  // industries: {
  //   type: [Schema.Types.ObjectId],
  //   required: true,
  // },
  paths: { type: [Schema.Types.ObjectId], ref: 'CareerPath' },
  jobs: { type: [Schema.Types.ObjectId], ref: 'JobRole' },

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
