import { Schema, model } from 'mongoose';
import { IQuestionDocument } from '../../interfaces/question';

const questionSchema = new Schema<IQuestionDocument>({
  text: {
    type: String,
    unique: true,
    required: true,
  },
  level: { type: String, required: true, default: 'advance' },
  responseOptions: [
    {
      responseId: { type: String, required: false },
      text: String,
      responseOption: String,
    },
  ],

  order: { type: Number, required: true },
  description: { type: String, required: false },
  category: { type: String, required: false },
  version: { type: Number, required: true },
  ageGroup: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
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

const QuestionModel = model<IQuestionDocument>('Question', questionSchema);

export { QuestionModel };
