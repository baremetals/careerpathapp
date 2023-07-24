import { Schema, model } from 'mongoose';
import { IUserQuestionResponseDocument } from '../../interfaces/user';

const userQuestionResponseSchema = new Schema<IUserQuestionResponseDocument>({
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

const UserQuestionResponseModel = model<IUserQuestionResponseDocument>(
  'UserQuestionResponse',
  userQuestionResponseSchema,
);

export { UserQuestionResponseModel };
