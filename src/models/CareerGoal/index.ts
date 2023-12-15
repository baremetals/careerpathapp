import { Schema, model } from 'mongoose';
import { ICareerGoalDocument } from '@/interfaces/userProfile';

const careerGoalSchema = new Schema<ICareerGoalDocument>({
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

const CareerGoalModel = model<ICareerGoalDocument>(
  'CareerGoal',
  careerGoalSchema,
);

export { CareerGoalModel };
