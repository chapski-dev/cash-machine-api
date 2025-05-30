import {
  Result,
  ValidationError,
  body,
  validationResult,
} from "express-validator";

import { AppError } from "errors";
import { NextFunction, Request, Response } from "express";
import { IRefreshTokenAttributes } from "types/auth";
import { VALIDATION_MESSAGES } from "constants/error-message";
import { HttpCode } from "constants/http";

const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .json({ errors: errors.array() });
  }
  next();
};

const validateAmount = body("amount")
  .custom((value) => {
    if (typeof value !== "number") {
      throw new Error(VALIDATION_MESSAGES.AMOUNT_TYPE);
    }
    return true;
  })
  .isFloat({ gt: 0 })
  .withMessage(VALIDATION_MESSAGES.AMOUNT_MIN)
  .custom((value) => {
    const stringValue = String(value);
    const pattern = /^\d+(\.\d{1,2})?$/;
    if (!pattern.test(stringValue)) {
      throw new Error(VALIDATION_MESSAGES.ONLY_TWO_DECINALS);
    }
    return true;
  })
  .customSanitizer((value) => parseFloat(value));

export const validator = {
  login: [
    body("email").isEmail().withMessage(VALIDATION_MESSAGES.INVALID_CREDENTIALS),
    body("password")
      .isLength({ min: 6 })
      .withMessage(VALIDATION_MESSAGES.INVALID_CREDENTIALS),
    handleValidationErrors,
  ],

  registration: [
    body("username").notEmpty().withMessage(VALIDATION_MESSAGES.NAME_REQUIRED),
    body("email").isEmail().withMessage(VALIDATION_MESSAGES.EMAIL_REQUIRED),
    body("password")
      .isLength({ min: 6 })
      .withMessage(VALIDATION_MESSAGES.PASWORD_LENGTH),
    handleValidationErrors,
  ],

  checkEmail: [
    body("email").isEmail().withMessage(VALIDATION_MESSAGES.EMAIL_REQUIRED),
    handleValidationErrors,
  ],

  refreshToken: [
    body("token").notEmpty().withMessage(VALIDATION_MESSAGES.TOKEN_REQUIRED),
    (
      req: Request<any, any, IRefreshTokenAttributes>,
      res: Response,
      next: NextFunction
    ) => handleValidationErrors(req, res, next),
  ],

  transfer: [
    validateAmount,
    handleValidationErrors,
  ],
};

export const validateRequest = (
  errors: Result<ValidationError>,
  errorData: {
    description: string;
    httpCode: HttpCode;
  }
) => {
  if (!errors.isEmpty()) {
    throw new AppError(errorData);
  }
};
