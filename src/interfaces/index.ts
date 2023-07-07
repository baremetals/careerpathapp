import { Document, Schema, Types } from 'mongoose';

enum QuestionType {
  OpenEnded = 'open-ended',
  ClosedEnded = 'closed-ended',
  List = 'list',
  Boolean = 'boolean',
}

// enum QuestionFocus {
//   JobRole = 'open-ended',
//   CareerPath = 'closed-ended',
// }

// enum QuestionType {
//   OpenEnded = 'open-ended',
//   ClosedEnded = 'closed-ended',
// }

interface IShared extends Document {
  createdAt: Date;
  lastModifiedAt: Date;
  createdBy: string;
  lastModifiedBy: string;
}

interface IQuestionDocument extends IShared {
  text: string;
  answers: string[];
  // category: Schema.Types.ObjectId;
  type?: QuestionType;
  focus: string;
  level: string;
  order: number;
  description?: string;
}

interface IQuestionResponseDocument extends IShared {
  user: Schema.Types.ObjectId;
  question: Schema.Types.ObjectId;
  response: string;
}

// interface ICategoryDocument extends IShared {
//   name: string;
//   type: string;
// }

interface IDecisionTreeRule extends IShared {
  questionId: Types.ObjectId;
  industry: Schema.Types.ObjectId;
  response: string;
  careerPaths: Array<Types.ObjectId>;
  jobRoles: Array<Schema.Types.ObjectId>;
  weight: number;
}

export {
  IShared,
  IQuestionDocument,
  IQuestionResponseDocument,
  IDecisionTreeRule,
};
