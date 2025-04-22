import { log } from "console";
import { AppError, HttpCode, errorHandler } from "errors";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers?.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    
    if (token) {
      jwt.verify(token, 'secret_key',(err, user) => {
        log('err -> ', err)
          if (err) {
            if (err.name === 'TokenExpiredError') {
              throw new AppError({
                description: "Token expired",
                httpCode: HttpCode.UNAUTHORIZED,
              });
            }
            throw new AppError({
              description: "Invalid token",
              httpCode: HttpCode.UNAUTHORIZED,
            });
          }
          req.body.user = user;
          next();
        }
      );
    } else {
      throw new AppError({
        description: "Invalid token",
        httpCode: HttpCode.FORBIDDEN,
      });
    }
  } catch (error: any) {
    return errorHandler.handleError(error, res);
  }
};
