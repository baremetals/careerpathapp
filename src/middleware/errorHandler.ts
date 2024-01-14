import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';
import { AppErrorDetails } from '../utils/types';

const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleIncomingErrorStatus = (error: any) => {
  let errorStatusCode: number;
  if (error.statusCode) {
    errorStatusCode = error.statusCode;
  } else if (error[0].statusCode) {
    errorStatusCode = error[0].statusCode;
  } else if (error[0].status || 401) {
    errorStatusCode = error[0].statusCode;
  } else {
    errorStatusCode = 401;
  }
  return errorStatusCode;
};

const handleIncomingErrors = (error: any) => {
  // console.error('ERROR============> 💥', error);
  let errors: AppErrorDetails[] | undefined;
  if (error[0] instanceof AppError) {
    errors = error.map((appError: AppError) => {
      const errorToReturn: AppErrorDetails = { message: appError.message };
      if (appError.field) errorToReturn.field = appError.field;
      return errorToReturn;
    });
  }
  return errors;
};

const sendErrorDev = (error: any, res: Response) => {
  const errorStatusCode: number = handleIncomingErrorStatus(error);
  const errors = handleIncomingErrors(error);
  let jsonToSend: object;

  if (errors) jsonToSend = errors;
  else {
    jsonToSend = {
      status: error.status,
      error: error,
      message: error.message,
      stack: error.stack,
    };
  }
  res.status(errorStatusCode || 500).json(jsonToSend);
};

const sendErrorProd = (err: any, _req: Request, res: Response) => {
  let errorStatusCode = 500;
  if (err.isOperational) {
    errorStatusCode = handleIncomingErrorStatus(err);
    const errors = handleIncomingErrors(err);
    let jsonToSend: object;

    if (errors) jsonToSend = errors;
    else {
      jsonToSend = {
        status: err.status,
        message: err.message,
      };
    }
    return res.status(errorStatusCode).json(jsonToSend);
  }
  console.error('ERROR============> 💥', err);
  return res.status(errorStatusCode).json({
    status: 'error',
    message: 'Something is wrong!',
  });
};

export default function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _Next: NextFunction,
) {
  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    sendErrorProd(error, req, res);
  } else {
    sendErrorDev(err, res);
  }
}
