import { Schema, model } from 'mongoose';
import { ICareerPathResponseAndWeight } from '../../interfaces/question';

const careerPathResponseAndWeightSchema =
  new Schema<ICareerPathResponseAndWeight>({
    questionId: { type: String, ref: 'Question' },
    careerPathId: { type: String, ref: 'CareerPath' },
    careerPath: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
    weight: { type: Number, required: true },
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

const CareerPathResponseAndWeightModel = model<ICareerPathResponseAndWeight>(
  'CareerPathResponseAndWeight',
  careerPathResponseAndWeightSchema,
);

export { CareerPathResponseAndWeightModel };
