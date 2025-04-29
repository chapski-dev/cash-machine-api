import * as Sentry from "@sentry/node";
import { HttpCode } from "constants/http";

interface AppErrorArgs {
  name?: string;
  httpCode: HttpCode;
  description: string;
  isOperational?: boolean;
}

export class AppError extends Error {
  public readonly name: string;
  public readonly httpCode: HttpCode;
  public readonly description: string;
  public readonly isOperational: boolean = true;

  constructor(args: AppErrorArgs) {
    super(args.description);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = args.name || 'Error';
    this.httpCode = args.httpCode;
    this.description = args.description;


    if (args.isOperational !== undefined) {
      this.isOperational = args.isOperational;
    }

    Sentry.captureException(this);
    Error.captureStackTrace(this);
  }
}