import { Schema, model } from 'mongoose';
import { ISkillDocument } from '../../interfaces/userProfile';

const skillSchema = new Schema<ISkillDocument>({
  name: { type: String, unique: true, required: true },
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

const SkillModel = model<ISkillDocument>('Skill', skillSchema);

export { SkillModel };
