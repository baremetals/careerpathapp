import request from 'supertest';
import { AppErrorDetails } from '../types';

export function responseBodyIncludesCustomErrorMessage(
  res: request.Response,
  errorMessage: string,
) {
  return res.body
    .map((error: AppErrorDetails) => error.message)
    .includes(errorMessage);
}
export function responseBodyIncludesCustomErrorField(
  res: request.Response,
  field: string,
) {
  return res.body.map((error: AppErrorDetails) => error.field).includes(field);
}
