import Factory from '@/factory';
import { QuestionModel } from '@/models/Question';

export const getAllQuestionsHandler = Factory.getMany({ Model: QuestionModel });
