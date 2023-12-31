import { IShared } from '@/interfaces';

type TResponseOption = {
  text: string;
  optionNumber: string;
};

interface IQuestionDocument extends IShared {
  text: string;
  responseOptions: Array<TResponseOption>;
  category: string;
  level: string;
  order: number;
  version: number;
  description?: string;
  ageGroup: {
    min: number;
    max: number;
  };
}

interface IQuestionResponseOptionDocument extends IShared {
  questionId: string;
  text: string;
  order: number;
}

/**
 * The weighting of responses varies for each career path based on the significance of the corresponding questions.
 * These weights are determined by considering the skill requirements of job roles within that specific career path.
 */

interface ICareerPathResponseAndWeight extends IShared {
  questionId: string;
  careerPath: string;
  careerPathId: string;
  response: string;
  weight: number;
}

export {
  ICareerPathResponseAndWeight,
  IQuestionDocument,
  IQuestionResponseOptionDocument,
  TResponseOption,
};
