export const VALIDATION_MESSAGES = {
  /** "Invalid email or password" */
  INVALID_CREDENTIALS: "Invalid email or password",
  /** "Valid email is required" */
  EMAIL_REQUIRED: "Valid email is required",
  /** "Name is required" */
  NAME_REQUIRED: "Name is required",
  /** "Token is required" */
  TOKEN_REQUIRED: "Token is required",
  /** "Amount must be a number" */
  AMOUNT_TYPE: "Amount must be a number",
  /** "Amount must be greater than 0" */
  AMOUNT_MIN: "Amount must be greater than 0",
  /** "Password must contain minimum 6 symbols" */
  PASWORD_LENGTH: 'Password must contains min 6 symbols',
};

export const ERROR_MESSAGES = {
  COMMON: {
    /** "Resource not found" */
    NOT_FOUND: (resource: string) => `${resource} not found`,
    /** "Invalid authentication credentials" */
    INVALID_CREDENTIALS: "Invalid credentials",
    /** "Access to resource is forbidden" */
    FORBIDDEN: "Forbidden",
  },

  AUTH: {
    /** "Auth required" */
    TOKEN_REQUIRED: "Auth required",
    /** "Token expired" */
    TOKEN_EXPIRED: "Token expired",
    /** "Invalid token" */
    INVALID_TOKEN: "Invalid token",
    /** "Invalid or expired refresh token" */
    REFRESH_TOKEN_INVALID: "Invalid or expired refresh token",
  },

  USER: {
    /** "User not found" */
    NOT_FOUND: 'User not found',
    /** "User already exists" */
    ALREADY_EXISTS: "User already exists",
    /** "Self-transfer is not allowed" */
    SELF_TRANSFER: "You can't send money to yourself",
  },

  TRANSACTION: {
    /** "Insufficient funds for transaction" */
    INSUFFICIENT_FUNDS: "Insufficient funds",
  },
};