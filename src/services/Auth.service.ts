import * as bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { userRepository } from '../repositories/user.repository';
import { refreshTokenRepository } from '../repositories/refreshToken.repository';
import { AppError, HttpCode } from "errors";
import { IUser } from "types";

const generateAccessToken = (user: IUser) => {
  return jwt.sign({ id: user.user_id, email: user.email }, 'secret_key', { expiresIn: '15m' });
};

const generateRefreshToken = () => {
  return uuidv4();
};

class AuthServices {
  async register (username: string, email: string, password: string ) {
      const existingUser = await userRepository.findUserByEmail(email);
      if (existingUser) {
        throw new AppError({
          description: "User already exists",
          httpCode: HttpCode.BAD_REQUEST,
        });
      }
      const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS) || 10);
      const user = await userRepository.createUser(username, email, hashedPassword);
      const refreshToken = generateRefreshToken();
      const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      //@ts-ignore
      await refreshTokenRepository.createRefreshToken(refreshToken, user.user_id, expires_at);
      const accessToken = generateAccessToken(user);
      return { accessToken, refreshToken };
  }

  async login (email: string, password: string) {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      throw new AppError({
        description: "Invalid credentials",
        httpCode: HttpCode.BAD_REQUEST,
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new AppError({
        description: "Invalid credentials",
        httpCode: HttpCode.BAD_REQUEST,
      });
    }
    
    const refreshToken = generateRefreshToken();
    const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    //@ts-ignore
    await refreshTokenRepository.createRefreshToken(refreshToken, user.user_id, expires_at);
    
    const accessToken = generateAccessToken(user);
    return { accessToken, refreshToken, user };
  };

  async checkEmailExists (email: string) {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      throw new AppError({
        description: 'User not found',
        httpCode: HttpCode.NOT_FOUND,
      });
    }
    return !!user;
  };

  async refreshAccessToken (refreshToken: string) {
    const tokenRecord = await refreshTokenRepository.findRefreshToken(refreshToken);
    if (!tokenRecord || tokenRecord.expires_at < new Date()) {
      throw new AppError({
        description: "Invalid or expired refresh token",
        httpCode: HttpCode.BAD_REQUEST,
      });
    }
    const user = await userRepository.findUserById(tokenRecord.user_id);
    if (!user) {
      throw new AppError({
        description: 'User not found',
        httpCode: HttpCode.NOT_FOUND,
      });
    }
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken();

    return { access_token: newAccessToken, refresh_token: newRefreshToken };
  };

  async deleteAccount (email: string) {
    await this.checkEmailExists(email); 
    await userRepository.deleteUser(email)
  };
}

export const authServices = new AuthServices();
