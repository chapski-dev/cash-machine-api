import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { userRepository } from "../repositories/user.repository";
import { refreshTokenRepository } from "../repositories/refreshToken.repository";
import { AppError, HttpCode } from "errors";
import { IUser } from "types/users";
import {
  AUTH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from "constants/auth";
import { ERROR_MESSAGES } from "constants/error-message";
import pool from "config/db";

const generateAccessToken = (user: IUser) => {
  return jwt.sign(
    { id: user.user_id, email: user.email },
    process.env.JWT_SECRET || "secret_key",
    { expiresIn: AUTH_TOKEN_EXPIRES_IN }
  );
};

const generateRefreshToken = () => {
  return uuidv4();
};

class AuthServices {
  async register(username: string, email: string, password: string) {
    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new AppError({
        description: ERROR_MESSAGES.USER.ALREADY_EXISTS,
        httpCode: HttpCode.BAD_REQUEST,
      });
    }
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS) || 10
    );
    await userRepository.createUser(
      username,
      email,
      hashedPassword
    );
  }

  async login(email: string, password: string) {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      throw new AppError({
        description: ERROR_MESSAGES.COMMON.INVALID_CREDENTIALS,
        httpCode: HttpCode.BAD_REQUEST,
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new AppError({
        description: ERROR_MESSAGES.COMMON.INVALID_CREDENTIALS,
        httpCode: HttpCode.BAD_REQUEST,
      });
    }

    const refreshToken = generateRefreshToken();
    await refreshTokenRepository.createRefreshToken(
      refreshToken,
      user.user_id,
      user.email,
      REFRESH_TOKEN_EXPIRES_IN
    );

    const accessToken = generateAccessToken(user);
    return { accessToken, refreshToken, user };
  }

  async checkEmailExists(email: string) {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      throw new AppError({
        description: ERROR_MESSAGES.USER.NOT_FOUND,
        httpCode: HttpCode.NOT_FOUND,
      });
    }
    return !!user;
  }

  async refreshAccessToken(refreshToken: string) {
    const client = await pool.connect();
    try {
      client.query("BEGIN");

      const tokenRecord = await refreshTokenRepository.findRefreshToken(
        refreshToken,
        client
      );

      if (!tokenRecord || tokenRecord.expires_at < new Date()) {
        throw new AppError({
          description: ERROR_MESSAGES.AUTH.REFRESH_TOKEN_INVALID,
          httpCode: HttpCode.BAD_REQUEST,
        });
      }

      await refreshTokenRepository.deleteRefreshToken(refreshToken, client);

      const user = await userRepository.findUserByEmail(tokenRecord.email, client);
      if (!user) {
        throw new AppError({
          description: ERROR_MESSAGES.USER.NOT_FOUND,
          httpCode: HttpCode.NOT_FOUND,
        });
      }

      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken();

      await refreshTokenRepository.createRefreshToken(
        newRefreshToken,
        user.user_id,
        user.email,
        REFRESH_TOKEN_EXPIRES_IN,
        client
      );

      await client.query("COMMIT");
      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async deleteAccount(email: string) {
    await userRepository.deleteUser(email);
  }
}

export const authServices = new AuthServices();
