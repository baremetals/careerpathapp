import { Schema, model } from 'mongoose';
import { IExperienceDocument } from '@/interfaces/userProfile';

const experienceSchema = new Schema<IExperienceDocument>({
  company: { type: String, required: true },
  position: { type: String, required: true },
  employmentPeriod: {
    startDate: Date,
    endDate: Date,
  },
  responsibilities: { type: String, required: true },
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

const ExperienceModel = model<IExperienceDocument>(
  'Experience',
  experienceSchema,
);

export { ExperienceModel };
