import { Schema, model } from 'mongoose';
import { IWorkEnvironmentDocument } from '../../interfaces/userProfile';

const workEnvironmentSchema = new Schema<IWorkEnvironmentDocument>({
  name: { type: String, required: true },
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

const WorkEnvironmentModel = model<IWorkEnvironmentDocument>(
  'WorkEnvironment',
  workEnvironmentSchema,
);

export { WorkEnvironmentModel };
