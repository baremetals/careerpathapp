import { object, string, TypeOf, z } from 'zod';
import {
  nameMaxLength,
  nameMinLength,
  passwordMaxLength,
  passwordMinLength,
} from '../lib/auth-validation-config';
import { ERROR_MESSAGES } from '../lib/error-messages';

export const registerUserSchema = object({
  body: object({
    firstName: string({
      required_error: ERROR_MESSAGES.VALIDATION.AUTH.REQUIRED_FIELD.NAME,
    })
      .min(nameMinLength, ERROR_MESSAGES.VALIDATION.AUTH.NAME_MIN_LENGTH)
      .max(nameMaxLength, ERROR_MESSAGES.VALIDATION.AUTH.NAME_MAX_LENGTH),
    lastName: string({
      required_error: ERROR_MESSAGES.VALIDATION.AUTH.REQUIRED_FIELD.NAME,
    })
      .min(nameMinLength, ERROR_MESSAGES.VALIDATION.AUTH.NAME_MIN_LENGTH)
      .max(nameMaxLength, ERROR_MESSAGES.VALIDATION.AUTH.NAME_MAX_LENGTH),
    email: string({
      required_error: ERROR_MESSAGES.VALIDATION.AUTH.REQUIRED_FIELD.EMAIL,
    }).email(ERROR_MESSAGES.VALIDATION.AUTH.INVALID_EMAIL),
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
    message: ERROR_MESSAGES.VALIDATION.AUTH.PASSWORDS_DO_NOT_MATCH,
  }),
});

export type RegisterUserSchema = z.infer<typeof registerUserSchema>;
export type UserRegistrationUserInput = TypeOf<
  typeof registerUserSchema
>['body'];
