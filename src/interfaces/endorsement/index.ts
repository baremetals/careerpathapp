import { IShared } from '@/interfaces';

interface IBaseEndorsement extends IShared {
  title: string;
  url: string;
  type: string;
  price: number;
  description: string;
  careerPaths: Array<string>;
  industries: Array<string>;
  tags: Array<string>;
  actionButton: string;
  endorsedBy: string;
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

interface IPersonEndorsementDocument extends IBaseEndorsement {
  fullName: string;
  image: string;
  profession: string;
}

interface IEducationProviderEndorsementDocument extends IBaseEndorsement {
  fullName: string;
  image: string;
  profession: string;
}

export {
  IArticleEndorsementDocument,
  IBookEndorsementDocument,
  ICourseEndorsementDocument,
  IPersonEndorsementDocument,
  IEducationProviderEndorsementDocument,
};
