import { IJobRoleDocument } from 'interfaces/careerPath';
import { Schema, model } from 'mongoose';

const jobRoleSchema = new Schema<IJobRoleDocument>({
  title: {
    type: String,
    required: true,
  },
  description: { type: String, required: true },
  averageStartingSalary: { type: Number || String, required: true },
  averageExperiencedSalary: { type: Number || String, required: true },
  educationRequirements: { type: [String], required: true },
  skills: { type: [String], required: true },
  careerPath: Schema.Types.ObjectId,
  progressPaths: { type: [String], required: true },
  relatedCareers: { type: [String], required: false },
  aliasTitles: { type: [String], required: false },
  // requiredResponses: {
  //   type: [{ question: Schema.Types.ObjectId, response: String || [String] }],
  //   required: true,
  // },
  // requiredWeight:{ type: Number, required: true },
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

const JobRoleModel = model<IJobRoleDocument>('JobRole', jobRoleSchema);

export { JobRoleModel };
