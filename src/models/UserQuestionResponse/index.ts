import { Schema, model } from 'mongoose';
import {
  IUserQuestionResponseDocument,
  TResponseType,
} from '@/interfaces/userProfile';

const responseSchema = new Schema<TResponseType>({
  questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  questionVersion: { type: Number, required: true },
  questionNumber: { type: Number, required: true },
  responseId: { type: Schema.Types.ObjectId, ref: 'ResponseOption' },
  responseToQuestion: { type: String, required: true },
});

const userQuestionResponseSchema = new Schema<IUserQuestionResponseDocument>({
  profileId: {
    type: Schema.Types.ObjectId,
    ref: 'UserProfile',
    required: true,
  },
  selectedIndustries: { type: [String], required: true },
  selectedInterests: { type: [String], required: false },
  responses: {
    type: [responseSchema],
    required: true,
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

const UserQuestionResponseModel = model<IUserQuestionResponseDocument>(
  'UserQuestionResponse',
  userQuestionResponseSchema,
);

userQuestionResponseSchema.index({ profileId: 1 }, { unique: true });
userQuestionResponseSchema.index({ 'responses.questionId': 1 });
export { UserQuestionResponseModel };
