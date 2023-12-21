import { ICareerPathDocument } from '@/interfaces/careerPath';
import { Schema, model } from 'mongoose';

const careerPathSchema = new Schema<ICareerPathDocument>({
  title: {
    type: String,
    required: true,
  },
  description: { type: String, required: true },
  requiredWeight: { type: Number, required: true },
  industries: { type: [String], ref: 'Industry' },
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

const CareerPathModel = model<ICareerPathDocument>(
  'CareerPath',
  careerPathSchema,
);

export { CareerPathModel };
