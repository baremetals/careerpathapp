import { IInterestDocument } from '../../interfaces/userProfile';
import { Schema, model } from 'mongoose';

const interestSchema = new Schema<IInterestDocument>({
  name: { type: String, unique: true, required: true },
  type: { type: String, required: false },
  // relatedCareerPaths: { type: [String], required: false },
  relatedCareerPaths: { type: [Schema.Types.ObjectId], ref: 'CareerPath' },
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

const InterestModel = model<IInterestDocument>('Interest', interestSchema);

export { InterestModel };
