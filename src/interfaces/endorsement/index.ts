import { IShared } from '@/interfaces';
import mongoose, { Schema } from 'mongoose';

interface IBaseEndorsement extends IShared {
  title: string;
  url: string;
  type: string;
  price: number;
  description: string;
  careerPaths: Array<Schema.Types.ObjectId>;
  industries: Array<Schema.Types.ObjectId>;
  tags: Array<Schema.Types.ObjectId>;
  actionButton: string;
  endorsedBy: mongoose.Types.ObjectId;
}

interface ICourseEndorsementDocument extends IBaseEndorsement {
  rating: number;
  teacher: number;
}

interface IBookEndorsementDocument extends IBaseEndorsement {
  rating: number;
  authors: Array<string>;
}

interface IArticleEndorsementDocument extends IBaseEndorsement {
  description: string;
  rating: number;
  authors: Array<string>;
}

interface IMentorEndorsementDocument extends IBaseEndorsement {
  fullName: string;
  image: string;
  profession: string;
}

export {
  IArticleEndorsementDocument,
  IBookEndorsementDocument,
  ICourseEndorsementDocument,
  IMentorEndorsementDocument,
};
