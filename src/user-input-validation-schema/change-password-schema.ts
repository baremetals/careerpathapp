import { TypeOf, object, string, z } from 'zod';
import {
  passwordMaxLength,
  passwordMinLength,
} from '../lib/auth-validation-config';
import { ERROR_MESSAGES } from '../lib/error-messages';

export const changePasswordSchema = object({
  body: object({
    currentPassword: string({
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
    newPassword: string({
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
  })
    .refine((data) => data.newPassword === data.confirmPassword, {
      path: ['confirmPassword'],
      message: ERROR_MESSAGES.VALIDATION.AUTH.PASSWORDS_DO_NOT_MATCH,
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
      path: ['newPassword'],
      message: ERROR_MESSAGES.AUTH.NEW_PASSWORD_MATCH_CURRENT_PASSWORD,
    }),
});

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

export type ChangePasswordUserInput = TypeOf<
  typeof changePasswordSchema
>['body'];
