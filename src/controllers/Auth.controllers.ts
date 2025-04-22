import { HttpCode, errorHandler } from "errors";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { authServices } from "services";
import { IRefreshTokenAttributes, IRegister } from "types/auth";
import { validateRequest } from "utils/validator";
class AuthController {

  async register (req: Request<IRegister, IRegister, IRegister>, res: Response) {
    console.log('register')
    const validationErrors = validationResult(req);
    try {
      validateRequest(validationErrors, {
        description: "Not valid data.",
        httpCode: HttpCode.BAD_REQUEST,
      });
      const { username, email, password } = req.body;
      const { accessToken, refreshToken } = await authServices.register(username, email, password);
      return res.status(201).json({ message: 'User registered successfully', accessToken, refreshToken });
    } catch (error: any) {
      return errorHandler.handleError(error, res, validationErrors);
    }
  }

  async login(req: Request, res: Response) {
    const validationErrors = validationResult(req);
    const { email, password } = req.body;
    try {
      validateRequest(validationErrors, {
        description: "Not valid data.",
        httpCode: HttpCode.BAD_REQUEST,
      });
      const {accessToken, refreshToken, user}  = await authServices.login(email, password);
      return res.status(200).json({ 
        accessToken, 
        refreshToken, 
        user,
      });
    } catch (error: any) {
      return errorHandler.handleError(error, res, validationErrors);
    }
  }

  async checkEmail(req: Request, res: Response) {
    const validationErrors = validationResult(req);
    try {
      validateRequest(validationErrors, {
        description: "Not valid data.",
        httpCode: HttpCode.BAD_REQUEST,
      });

      const { email } = req.body;
      const isExist = await authServices.checkEmailExists(email);
      return res.status(200).json({ is_exist: isExist });
    } catch (error: any) {
      return errorHandler.handleError(error, res, validationErrors);
    }
  }

  async refreshToken(req: Request<IRefreshTokenAttributes, IRefreshTokenAttributes, IRefreshTokenAttributes>, res: Response) {
    const validationErrors = validationResult(req);
    try {
      validateRequest(validationErrors, {
        description: "Not valid data.",
        httpCode: HttpCode.BAD_REQUEST,
      });

      const { token } = req.body;
      const { access_token, refresh_token } = await authServices.refreshAccessToken(token);
      return res.status(200).json({ message: 'Token refreshed', access_token, refresh_token });
    } catch (error: any) {
      return errorHandler.handleError(error, res, validationErrors);
    }
  }
}

export const authController = new AuthController();