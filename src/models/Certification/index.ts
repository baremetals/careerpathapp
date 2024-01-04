import { Schema, model } from 'mongoose';
import { ICertificationDocument } from '@/interfaces/userProfile';

const certificationSchema = new Schema<ICertificationDocument>({
  certificationBody: { type: String, required: true },
  certificationName: { type: String, required: true },
  certificationDate: Date,
  description: { type: String, required: true },
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

const CertificationModel = model<ICertificationDocument>(
  'Certification',
  certificationSchema,
);

export { CertificationModel };
