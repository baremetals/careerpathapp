export enum EndorsementType {
  VIDEO = 'video',
  INDUSTRY = 'industry',
  BOOK = 'book',
  COURSE = 'course',
  CAREER_PATH = 'career_path',
  PERSON = 'person',
}

export enum PlayerRole {
  HOST = 'host',
  CHALLENGER = 'challenger',
}

export enum UserInputs {
  CLIENT_TICK_NUMBER,
  SELECT_ORBS,
  ASSIGN_DESTINATIONS_TO_SELECTED_ORBS,
  ASSIGN_DESTINATIONS_TO_ORBS,
  SELECT_ORB_AND_ASSIGN_DESTINATION,
  LINE_UP_ORBS_HORIZONTALLY_AT_Y,
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

export enum IPBanReason {
  RATE_LIMIT_ABUSE = 'rate_limit_abuse',
  CHAT = 'chat',
}

export const FrontendRoutes = {
  CHANGE_PASSWORD: '/change-password',
  ACCOUNT_ACTIVATION: '/account-activation',
  LOGIN: '/login',
  SETTINGS: '/settings',
  BATTLE_ROOM: '/battle-room',
  LADDER: '/ladder',
  REGISTER: '/register',
};
