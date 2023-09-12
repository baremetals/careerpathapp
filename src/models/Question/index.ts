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
      responseId: String,
      text: String,
    },
  ],

  order: { type: Number, required: true },
  description: { type: String, required: false },
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

const QuestionModel = model<IQuestionDocument>('Question', questionSchema);

export { QuestionModel };
