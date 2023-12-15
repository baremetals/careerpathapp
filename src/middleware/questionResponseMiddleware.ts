import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { questionResponseSchema } from '@/user-input-validation-schema/question-responses-schema';
import AppError from '@/utils/appError';
import catchAsync from '@/utils/catchAsync';
import { HTTP_STATUS_CODES } from '@/lib/status-codes';

/**
 * Data validation middleware
 */

const questionResponseMiddleware = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      questionResponseSchema.parse(req.body);
      next();
    } catch (error) {
      // ZodError contains all validation errors
      if (error instanceof ZodError) {
        const errors = error.errors.map((error) => {
          let field;
          if (error.path[0] === 'body' && error.path[1])
            field = error.path[1] as string;
          console.log(field);
          return new AppError(
            error.message,
            HTTP_STATUS_CODES.BAD_REQUEST,
            field,
          );
        });
        next(errors);
      }
      next(error);
    }
  },
);
export default questionResponseMiddleware;
