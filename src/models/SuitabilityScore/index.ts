import { Schema, model } from 'mongoose';
import {
  ISuitabilityScoreDocument,
  TSuitabilityScoreType,
} from '@/interfaces/userProfile';

const scoresSchema = new Schema<TSuitabilityScoreType>({
  industryName: { type: String, required: true },
  industryId: { type: Schema.Types.ObjectId, required: true },
  score: { type: Number, required: true },
});

const suitabilityScoreSchema = new Schema<ISuitabilityScoreDocument>({
  profileId: {
    type: Schema.Types.ObjectId,
    ref: 'UserProfile',
    required: true,
  },
  industriesAndScores: {
    type: [scoresSchema],
    required: true,
  },

  chosenIndustriesAndScores: {
    type: [scoresSchema],
    required: false,
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

const SuitabilityScoreModel = model<ISuitabilityScoreDocument>(
  'SuitabilityScore',
  suitabilityScoreSchema,
);

suitabilityScoreSchema.index({ profileId: 1 }, { unique: true });
suitabilityScoreSchema.index({ 'responses.questionId': 1 });
export { SuitabilityScoreModel };
