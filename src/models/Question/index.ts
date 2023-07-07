import { Schema, model } from 'mongoose';
import { IQuestionDocument } from 'interfaces/';


const questionSchema = new Schema<IQuestionDocument>({
  text: {
    type: String,
    required: true,
  },
  type: { type: String, required: false },
  focus: { type: String, required: true },
  level: { type: String, required: true, default: 'advance' },
  answers: { type: [String], required: true },
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