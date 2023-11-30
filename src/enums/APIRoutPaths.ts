export enum AuthRoutePaths {
  ROOT = '/auth',
  REGISTER = '/register',
  ACCOUNT_ACTIVATION = '/account-activation',
  LOGOUT = '/logout',
  FORGOT_PASSWORD_RESET_EMAIL = '/request-password-reset-email',
  RESET_PASSWORD = '/reset-password',
}

export enum UsersRoutePaths {
  ROOT = '/users',
  ME = '/me',
  CHANGE_PASSWORD = '/change-password',
  ACCOUNT_DELETION = '/account-deletion',
  ACCOUNT_BAN = '/account-ban',
  UPLOAD_AVATAR = '/upload-avatar',
  UPLOADS = '/uploads',
}

export enum CareerRoutePaths {
  ROOT = '/careers',
  QUESTIONS = '/questions',
  QUESTION_RESPONSES = '/question-responses',
  CAREER_PATHS = '/career-paths',
}

export enum AdminRoutePaths {
  ROOT = '/admin',
  PASSWORD = '/password',
  ACCOUNT_DELETION = '/account-deletion',
  ACCOUNT_BAN = '/account-ban',
}

export enum ModerationRoutePaths {
  ROOT = '/moderation',
  IP_BAN = '/ip-ban',
}

export enum CypressTestRoutePaths {
  ROOT = '/cypress-tests',
  DROP_ALL_TEST_USERS = '/drop-all-test-users',
  CREATE_SEQUENTIAL_ELO_TEST_USERS = '/create-sequential-elo-test-users',
  CREATE_CYPRESS_TEST_USER = '/create-cypress-test-user',
  RATE_LIMITER = '/rate-limiter',
}
