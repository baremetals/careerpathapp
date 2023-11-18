import { Schema, model } from 'mongoose';
import { IUserQuestionResponseDocument } from '../../interfaces/user';

const userQuestionResponseSchema = new Schema<IUserQuestionResponseDocument>({
  profileId: {
    type: Schema.Types.ObjectId,
    ref: 'UserProfile',
    required: true,
  },
  selectedIndustries: { type: [String] },
  selectedInterests: { type: [String] },
  responses: [
    {
      questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
      questionVersion: { type: Number, required: true },
      responseId: { type: Schema.Types.ObjectId, ref: 'ResponseOption' },
      responseOption: { type: String, required: true },
    },
  ],

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

userQuestionResponseSchema.index({ profileId: 1 });
userQuestionResponseSchema.index({ 'responses.questionId': 1 });
export { UserQuestionResponseModel };
