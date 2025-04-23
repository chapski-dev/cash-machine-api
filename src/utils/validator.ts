import { Result, ValidationError, body } from "express-validator";
import { ERROR_MESSAGE } from "../constants";
import { AppError, HttpCode } from "errors";
import { log } from "console";

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
  refreshToken: [body('token').notEmpty().withMessage('Token is required')],

  deposit: [
    body('amount')
    // 1. Проверка типа данных
    .custom(value => typeof value === 'number') 
    .withMessage("Amount must be a number type (not string)")
    
    // 2. Проверка на минимальное значение
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than 0")
  ],

}

export const validateRequest = (errors: Result<ValidationError>, errorData: {
  description: string,
  httpCode: HttpCode,
}) => {
  if (!errors.isEmpty()) {
    throw new AppError(errorData);
  }
};
