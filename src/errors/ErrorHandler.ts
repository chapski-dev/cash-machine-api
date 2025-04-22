import { Response } from "express";
import { AppError, HttpCode } from "./AppError";
import { Result, ValidationError } from "express-validator";

class ErrorHandler {
  private handleTrustedError(
    error: AppError,
    response: Response,
    validationErrors?: Result<ValidationError>
  ): void {
    response
      .status(error.httpCode)
      .json(
        validationErrors && !validationErrors?.isEmpty()
          ? {
              message: error.message,
              errors: validationErrors.array(),
            }
          : { message: error.message }
      );
  }

  private handleCriticalError(
    error: Error | AppError,
    response?: Response
  ): void {
    if (response) {
      response
        .status(HttpCode.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
    console.error(error);
    console.log("Application encountered a critical error. Exiting");
    process.exit(1);
  }

  private isTrustedError(error: Error): boolean {
    if (error instanceof AppError) {
      return error.isOperational;
    }

    return false;
  }

  public handleError(
    error: Error | AppError,
    response?: Response,
    validationErrors?: Result<ValidationError>
  ): void {
    if (this.isTrustedError(error) && response) {
      this.handleTrustedError(error as AppError, response, validationErrors);
    } else {
      this.handleCriticalError(error, response);
    }
  }
}

export const errorHandler = new ErrorHandler();
