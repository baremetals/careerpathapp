export default class AppError extends Error {
  message: string;
  statusCode: number;
  status: string;
  isOperational: boolean;
  field: string | undefined;

  constructor(message: string, statusCode: number, field?: string) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.field = field;

    Error.captureStackTrace(this, this.constructor);
  }
}
