import { ERROR_MESSAGES } from '../lib/error-messages';
import { object, string, TypeOf } from 'zod';

export const forgotPasswordSchema = object({
  body: object({
    email: string({
      required_error: ERROR_MESSAGES.VALIDATION.AUTH.REQUIRED_FIELD.EMAIL,
    }).email(ERROR_MESSAGES.VALIDATION.AUTH.REQUIRED_FIELD.EMAIL),
  }),
});
export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>['body'];
