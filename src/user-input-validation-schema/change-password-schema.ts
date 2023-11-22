import {
  passwordMaxLength,
  passwordMinLength,
} from '../lib/auth-validation-config';
import { ERROR_MESSAGES } from '../lib/error-messages';
import { TypeOf, object, string, z } from 'zod';

export const changePasswordSchema = object({
  body: object({
    password: string({
      required_error: ERROR_MESSAGES.VALIDATION.AUTH.REQUIRED_FIELD.PASSWORD,
    })
      .min(
        passwordMinLength,
        ERROR_MESSAGES.VALIDATION.AUTH.PASSWORD_MIN_LENGTH,
      )
      .max(
        passwordMaxLength,
        ERROR_MESSAGES.VALIDATION.AUTH.PASSWORD_MAX_LENGTH,
      ),
    confirmPassword: string({
      required_error:
        ERROR_MESSAGES.VALIDATION.AUTH.REQUIRED_FIELD.PASSWORD_CONFIRMATION,
    }),
  }).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: ERROR_MESSAGES.VALIDATION.AUTH.PASSWORDS_DONT_MATCH,
  }),
});

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

export type ChangePasswordUserInput = TypeOf<
  typeof changePasswordSchema
>['body'];
