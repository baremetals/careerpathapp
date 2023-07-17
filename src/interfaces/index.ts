import { Document } from 'mongoose';

interface IShared extends Document {
  createdAt: Date;
  lastModifiedAt: Date;
  createdBy: string;
  lastModifiedBy: string;
}

// interface ICategoryDocument extends IShared {
//   name: string;
//   type: string;
// }

export { IShared };
