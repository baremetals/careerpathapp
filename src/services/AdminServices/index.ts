import { Request, Response } from 'express';
import { QuestionModel } from '@/models/Question';
import { QuestionResponseOptionModel } from '@/models/QuestionResponseOption';
import catchAsync from '@/utils/catchAsync';

interface QuestionInput {
  text: string;
  category: string;
  order: number;
  responseOptions: {
    responseId?: string;
    text: string;
    order: number;
  }[];
}
const saveQuestionsAndResponses = () =>
  catchAsync(async (req: Request, res: Response) => {
    const { questions }: { questions: QuestionInput[] } = req.body;

    await Promise.all(
      questions.map(async (question) => {
        const createdQuestion = await QuestionModel.create({
          text: question.text,
          responseOptions: [],
          category: question.category,
          level: 'advance',
          order: question.order,
        });

        const responseOptionsPromises = question.responseOptions.map(
          async (resOption) => {
            const response = await QuestionResponseOptionModel.create({
              questionId: createdQuestion._id,
              text: resOption.text,
              order: resOption.order,
            });
            return {
              responseId: response._id.toString(),
              text: resOption.text,
            };
          },
        );
        const responseOptions = await Promise.all(responseOptionsPromises);
        await QuestionModel.findByIdAndUpdate(createdQuestion._id, {
          responseOptions,
        });
      }),
    );

    res.status(201).json({
      status: 'success',
      message: 'questions added.',
    });
  });

export { saveQuestionsAndResponses };
