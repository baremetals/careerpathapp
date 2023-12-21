import { IIndustryDocument } from '@/interfaces/careerPath';
import { Schema, model } from 'mongoose';

const industrySchema = new Schema<IIndustryDocument>({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  description: { type: String, required: false },
  careerPaths: { type: [Schema.Types.ObjectId], ref: 'CareerPath' },
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

const IndustryModel = model<IIndustryDocument>('Industry', industrySchema);

export { IndustryModel };
