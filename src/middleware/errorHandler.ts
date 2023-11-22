import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import { AppErrorDetails } from '../utils/types';

// const handleCastErrorDB = (err: any) => {
//   const message = `Invalid ${err.path}: ${err.value}.`;
//   return new AppError(message, 400);
// };

// const handleDuplicateFieldsDB = (err: any) => {
//   const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

//   const message = `Duplicate field value: ${value}. Please use another value!`;
//   return new AppError(message, 400);
// };

// const handleValidationErrorDB = (err: any) => {
//   const errors = Object.values(err.errors).map((el: any) => el.message);

//   const message = `Invalid input data. ${errors.join('. ')}`;
//   return new AppError(message, 400);
// };

const sendErrorDev = (error: any, res: Response) => {
  // console.error('ERROR 💥', error);
  const errorStatusCode = error.statusCode
    ? error.statusCode
    : error[0].statusCode
    ? error[0].statusCode
    : 401;
  let errors: AppErrorDetails[] | undefined;
  if (error[0] instanceof AppError) {
    // console.error('I AM, RUNNING💥');
    errors = error.map((appError: AppError) => {
      const errorToReturn: AppErrorDetails = { message: appError.message };
      // console.error('ERROR 💥', errorToReturn);
      if (appError.field) errorToReturn.field = appError.field;
      // errorToReturn;
      return errorToReturn;
    });
  }
  let jsonToSend;

  if (errors) jsonToSend = errors;
  else {
    jsonToSend = {
      status: error.status,
      error: error,
      message: error.message,
      stack: error.stack,
    };
  }
  res.status(errorStatusCode).json(jsonToSend);
};

const sendErrorProd = (err: any, _req: Request, res: Response) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  console.error('ERROR============> 💥', err);
  return res.status(500).json({
    status: 'error',
    message: 'Something is wrong!',
  });
};

export default function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    const error = { ...err };
    error.message = err.message;

    //   if (error.name === 'CastError') error = handleCastErrorDB(error);
    //   if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    //   if (error.name === 'ValidationError')
    // error = handleValidationErrorDB(error);
    //   if (error.name === 'JsonWebTokenError') error = handleJWTError();
    //   if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
}
