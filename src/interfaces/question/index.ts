import { Types } from 'mongoose';
import { IShared } from '../../interfaces';

type TResponseOption = {
  responseId: string;
  text: string;
};

interface IQuestionDocument extends IShared {
  text: string;
  responseOptions: TResponseOption[];
  category: string;
  level: string;
  order: number;
  description?: string;
}

interface IQuestionResponseOptionDocument extends IShared {
  questionId: Types.ObjectId;
  text: string;
  order: number;
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

export {
  ICareerPathResponseAndWeight,
  IQuestionDocument,
  IQuestionResponseOptionDocument,
  TResponseOption,
};
