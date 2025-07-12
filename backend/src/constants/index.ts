// Application constants
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const;

export const JWT_CONSTANTS = {
  EXPIRES_IN: "24h",
  ALGORITHM: "HS256"
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  EMAIL_INVALID: "Please provide a valid email address",
  PASSWORD_MIN_LENGTH: "Password must be at least 8 characters long",
  PASSWORD_WEAK: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
} as const;
