import { Schema, model } from 'mongoose';
import { IEducationDocument } from '../../interfaces/userProfile';

const educationSchema = new Schema<IEducationDocument>({
  school: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  startDate: Date,
  endDate: Date,

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

const EducationModel = model<IEducationDocument>('Education', educationSchema);

export { EducationModel };
