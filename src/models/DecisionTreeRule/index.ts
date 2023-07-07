import { Schema, model } from 'mongoose';
import { IDecisionTreeRule } from 'interfaces/';

const decisionTreeRuleSchema = new Schema<IDecisionTreeRule>({
  questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
  response: {
    type: String,
    required: true,
  },
  industry: { type: Schema.Types.ObjectId, ref: 'Industry' },
  careerPaths: { type: [Schema.Types.ObjectId], ref: 'CareerPath' },
  jobRoles: { type: [Schema.Types.ObjectId], ref: 'JobRole' },
  weight: { type: Number, required: true },
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

const DecisionTreeRuleModel = model<IDecisionTreeRule>(
  'DecisionTreeRule',
  decisionTreeRuleSchema,
);

export { DecisionTreeRuleModel };
