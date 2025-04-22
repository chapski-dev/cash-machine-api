import { NextFunction, Request } from "express";
import { Result, ValidationError, body, validationResult } from "express-validator";
import { ERROR_MESSAGE } from "../constants";
import { IRegister } from "types/auth";
import { AppError, HttpCode } from "errors";

export const validator = {
  login: [
    body("email")
      .isEmail()
      .withMessage('Invalid email or password'),
    body("password")
      .isLength({ min: 6 })
      .withMessage('Invalid email or password'),
  ],
  
  registration: [
    body('username').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage(ERROR_MESSAGE.easy_password),
  ],

  checkEmail: [body('email').isEmail().withMessage('Valid email is required')],
  refreshToken: [ body('token').notEmpty().withMessage('Token is required') ],
}

export const validateRequest = (errors:  Result<ValidationError>, errorData: {
  description: string,
  httpCode: HttpCode,
}) => {
  if (!errors.isEmpty()) {
    throw new AppError(errorData);
  }
};
