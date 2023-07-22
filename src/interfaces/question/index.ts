import { Types } from 'mongoose';
import { IShared } from '../../interfaces';

enum QuestionType {
  OpenEnded = 'open-ended',
  ClosedEnded = 'closed-ended',
  List = 'list',
  Boolean = 'boolean',
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

/**
 * The weighting of responses varies for each career path based on the significance of the corresponding questions.
 * These weights are determined by considering the skill requirements of job roles within that specific career path.
 */

interface ICareerPathResponseAndWeight extends IShared {
  questionId: Types.ObjectId;
  careerPath: string;
  careerPathId: Types.ObjectId;
  response: string;
  weight: number;
}

export { ICareerPathResponseAndWeight, IQuestionDocument };
