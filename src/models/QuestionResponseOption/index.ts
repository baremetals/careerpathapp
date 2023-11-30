import { Schema, model } from 'mongoose';
import { IQuestionResponseOptionDocument } from '../../interfaces/question';

const questionResponseOptionSchema =
  new Schema<IQuestionResponseOptionDocument>({
    questionId: Schema.Types.ObjectId,
    text: {
      type: String,
      unique: true,
      required: true,
    },
    order: {
      type: Number,
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

const QuestionResponseOptionModel = model<IQuestionResponseOptionDocument>(
  'QuestionResponseOption',
  questionResponseOptionSchema,
);

export { QuestionResponseOptionModel };
