import { ERROR_MESSAGES } from "constants/error-message";
import { AppError, HttpCode, errorHandler } from "errors";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { userRepository } from "repositories/user.repository";


type DecodedJWT = {
  id: string,
  email: string,
  iat: number,
  exp: number
}

let decoded: DecodedJWT;

export const authToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers?.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    
    if(!token) {
      throw new AppError({
        description: ERROR_MESSAGES.AUTH.TOKEN_REQUIRED,
        httpCode: HttpCode.FORBIDDEN,
      });
    }


    jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, decodedVal) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          throw new AppError({
            description: ERROR_MESSAGES.AUTH.TOKEN_EXPIRED,
            httpCode: HttpCode.UNAUTHORIZED,
          });
        }
        throw new AppError({
          description: ERROR_MESSAGES.AUTH.INVALID_TOKEN,
          httpCode: HttpCode.UNAUTHORIZED,
        });
      }
      decoded = decodedVal as DecodedJWT;
    });

    const user = await userRepository.findUserByEmail(decoded.email);

    if (!user) {
      throw new AppError({
        description: ERROR_MESSAGES.USER.NOT_FOUND,
        httpCode: HttpCode.UNAUTHORIZED,
      });
    }
    req.body.user = user;
    next();

  } catch (error: any) {
    return errorHandler.handleError(error, res);
  }
};
