import { SUCCESS_MESSAGES } from "constants/response-message";
import { errorHandler } from "errors";
import { Request, Response } from "express";
import { authServices } from "services";
import { ILoginBody, IRefreshTokenAttributes, IRegister } from "types/auth";
class AuthController {

  async register(req: Request<any, any, IRegister>, res: Response) {
    try {
      const { username, email, password } = req.body;
      await authServices.register(username, email, password);
      return res.status(201).json({ message: SUCCESS_MESSAGES.AUTH.REGISTERED });
    } catch (error: any) {
      return errorHandler.handleError(error, res);
    }
  }

  async login(req: Request<any, any, ILoginBody>, res: Response) {
    const { email, password } = req.body;
    try {
      const { accessToken, refreshToken } = await authServices.login(email, password);
      return res.status(200).json({
        accessToken,
        refreshToken,
      });
    } catch (error: any) {
      return errorHandler.handleError(error, res);
    }
  }

  async checkEmail(req: Request<any, any, { email: string }>, res: Response) {
    try {
      const { email } = req.body;
      const isExist = await authServices.checkEmailExists(email);
      return res.status(200).json({ is_exist: isExist });
    } catch (error: any) {
      return errorHandler.handleError(error, res);
    }
  }

  async refreshToken(req: Request<any, any, IRefreshTokenAttributes>, res: Response) {
    try {
      const { token } = req.body;
      const { access_token, refresh_token } = await authServices.refreshAccessToken(token);
      return res.status(200).json({ message: SUCCESS_MESSAGES.AUTH.TOKENS_REFRESHED, access_token, refresh_token });
    } catch (error: any) {
      return errorHandler.handleError(error, res);
    }
  }

  async deleteAccount(req: Request, res: Response) {
    try {
      const { email } = req.body.user;
      await authServices.deleteAccount(email);
      return res.status(200).json({ message: SUCCESS_MESSAGES.AUTH.ACCOUNT_DELETED });
    } catch (error: any) {
      return errorHandler.handleError(error, res);
    }
  }
}

export const authController = new AuthController();