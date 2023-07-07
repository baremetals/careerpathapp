import { Schema, model } from 'mongoose';
import { IQuestionResponseDocument } from 'interfaces/';

const questionResponseSchema = new Schema<IQuestionResponseDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  question: { type: Schema.Types.ObjectId, ref: 'Question' },
  response: {
    type: String,
    required: true,
  },

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

const QuestionResponseModel = model<IQuestionResponseDocument>(
  'QuestionResponse',
  questionResponseSchema,
);

export { QuestionResponseModel };
