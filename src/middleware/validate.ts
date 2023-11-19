import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import AppError from '../utils/appError';

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse({
        params: req.params,
        query: req.query,
        body: req.body,
      });
      next();
    } catch (err: any) {
      if (err instanceof ZodError) {
        const errors = err.errors.map((error) => {
          let field;
          if (error.path[0] === 'body' && error.path[1])
            field = error.path[1] as string;
          console.log(field);
          return next(new AppError(error.message, 400));
        });
        next(errors);
      } else next(err);
    }
  };
