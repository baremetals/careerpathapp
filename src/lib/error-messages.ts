import {
  nameMaxLength,
  nameMinLength,
  passwordMaxLength,
  passwordMinLength,
} from './auth-validation-config';

export const ERROR_MESSAGES = {
  SERVER_GENERIC: 'Internal server error',
  SERVER_RESPONSE_NOT_JSON: 'External server response not JSON',
  AUTH: {
    ADMIN_FORBIDDEN: 'You do not have permission to perform this action',
    NOT_LOGGED_IN: 'You are not logged in',
    INVALID_OR_EXPIRED_TOKEN: 'Invalid or expired token',
    EXPIRED_SESSION: 'User session has expired, please log in again',
    USED_OR_EXPIRED_ACCOUNT_CREATION_SESSION:
      'Either you have already created an account with this token or it has been too long since you initiated account creation, please try registering again to get a new account activation email',
    INVALID_CREDENTIALS: 'Incorrect email or password',
    INVALID_CREDENTIALS_WITH_ATTEMPTS_REMAINING: (remaining: number) => {
      if (remaining === 0)
        return `Incorrect email or password, this is your final attempt before account will be locked`;
      return `Incorrect email or password, you have ${remaining} attempts remaining`;
    },
    NO_USER_EXISTS: `The specified user doesn't exists`,
    ROLE_RESTRICTED: 'That action is role restricted',
    EMAIL_DOES_NOT_EXIST: 'No user with that email exists',
    EMAIL_IN_USE_OR_UNAVAILABLE:
      'The specified email is already in use or is unavailable',
    NAME_IN_USE_OR_UNAVAILABLE:
      'The specified name is already in use or is unavailable',
    CHANGE_PASSWORD_EMAIL: 'Error trying to send password reset email',
    CHANGE_PASSWORD_EMAIL_FAILED:
      'Error trying to reset password, please try again later',
    CHANGE_PASSWORD_TOKEN:
      'No token provided - use the link in your email to get a page with a token',
    ACCOUNT_BANNED: 'The specified account has been banned',
    PASSWORD_RESET_EMAIL_DOES_NOT_MATCH_TOKEN:
      'The provided email address did not match with the password reset token',
    NEW_PASSWORD_MATCH_CURRENT_PASSWORD:
      'The new password provided is the same as the current one. Please update your password',
    ACCOUNT_LOCKED:
      'Your account has been locked for security reasons, please reset your password to regain access',
  },
  USER: {
    ACCOUNT_DELETION: 'An error occurred when trying to delete your account',
  },
  ADMIN: {
    NO_IP_TO_BAN: 'No IP address was found',
  },
  FACTORY: {
    DOC_NOT_FOUND: 'Document not found',
    NO_DOCUMENTS: 'No documentS provided',
    REQUIRED_FILTER_OR_UPDATE: 'Filter and update data are required',
  },
  UPLOAD: {
    NOT_AN_IMAGE: 'Not an image! Please upload only images.',
    NOT_A_FILE: 'Not a FILE! Please upload only approved file types.',
    LARGE_FILE_SIZE:
      'Image too large please upload a smaller size than 1069736',
    UPLOAD_FAILED: 'Upload failed, please try again later.',
  },
  VALIDATION: {
    AUTH: {
      REQUIRED_FIELD: {
        NAME: 'A name is required',
        EMAIL: 'An email address is required',
        PASSWORD: 'Please enter a password',
        PASSWORD_CONFIRMATION: 'Please confirm your password',
      },
      CONFIRM_DELETE_ACCOUNT_EMAIL_MATCH:
        "Email address typed did not match your account's email",
      INVALID_EMAIL: 'Invalid email',
      INVALID_PASSWORD: 'The current password provided is invalid',
      PASSWORD_MIN_LENGTH: `Password must be at least ${passwordMinLength} characters`,
      PASSWORD_MAX_LENGTH: `Password must be no longer than ${passwordMaxLength} characters`,
      PASSWORDS_DONT_MATCH: 'Password confirmation does not match the password',
      NAME_MIN_LENGTH: `Name must be at least ${nameMinLength} characters`,
      NAME_MAX_LENGTH: `Name must be no longer than ${nameMaxLength} characters`,
    },
  },
  CAREER_PATH: {
    ISSUE_SAVING_RESPONSES:
      'Sorry your responses could not be saved please try again later',
    INDUSTRY_MISSING: 'Please provide at least one industry.',
    SKILLS_MISSING: 'Please provide at least one skill',
    MISSING_RESPONSE: 'Please provide a response for all questions',
  },
};
