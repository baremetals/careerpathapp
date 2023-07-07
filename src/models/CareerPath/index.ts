import { ICareerPathDocument } from 'interfaces/careerPath';
import { Schema, model } from 'mongoose';

const careerPathSchema = new Schema<ICareerPathDocument>({
  title: {
    type: String,
    required: true,
  },
  description: { type: String, required: true },
  industries: { type: [Schema.Types.ObjectId], ref: 'Industry' },
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

const CareerPathModel = model<ICareerPathDocument>(
  'CareerPath',
  careerPathSchema,
);

export { CareerPathModel };
