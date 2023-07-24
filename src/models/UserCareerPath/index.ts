import { Schema, model } from 'mongoose';
import { IUserCareerPathDocument } from '../../interfaces/userProfile';

const userCareerPathSchema = new Schema<IUserCareerPathDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'UserProfile' },
  industry: {
    type: String,
    required: true,
  },
  paths: { type: [Schema.Types.ObjectId], ref: 'CareerPath' },
  jobs: { type: [Schema.Types.ObjectId], ref: 'JobRole' },

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

const UserCareerPathModel = model<IUserCareerPathDocument>(
  'UserCareerPath',
  userCareerPathSchema,
);

export { UserCareerPathModel };
