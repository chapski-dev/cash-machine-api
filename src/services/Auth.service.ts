import * as bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { userRepository } from '../repositories/user.repository';
import { refreshTokenRepository } from '../repositories/refreshToken.repository';
import { log } from "console";

const generateAccessToken = (user: any) => {
  return jwt.sign({ id: user.id, email: user.email }, 'secret_key', { expiresIn: '15m' });
};

const generateRefreshToken = () => {
  return uuidv4();
};

class AuthServices {
  async register (username: string, email: string, password: string ) {
      const existingUser = await userRepository.findUserByEmail(email);
      log('existingUser', existingUser)
      if (existingUser) {
        throw new Error('User already exists');
      }
      log("process.env.SALT_ROUNDS", typeof process.env.SALT_ROUNDS)
      const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS) || 10);
      log('hashedPassword', hashedPassword)
      const user = await userRepository.createUser(username, email, hashedPassword);
      log('createUser ', user)
      const refreshToken = generateRefreshToken();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      //@ts-ignore
      await refreshTokenRepository.createRefreshToken(refreshToken, user.id, expiresAt);
      log('createRefreshToken ', refreshToken)
      const accessToken = generateAccessToken(user);
      return { accessToken, refreshToken };
  }

  async login (email: string, password: string) {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    
    const refreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    //@ts-ignore
    await refreshTokenRepository.createRefreshToken(refreshToken, user.id, expiresAt);
    
    const accessToken = generateAccessToken(user);
    return { accessToken, refreshToken, user };
  };

  async checkEmailExists (email: string) {
    const user = await userRepository.findUserByEmail(email);
    return !!user;
  };

  async refreshAccessToken (refreshToken: string) {
    const tokenRecord = await refreshTokenRepository.findRefreshToken(refreshToken);
    log('tokenRecord => ', tokenRecord)
    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }
    const user = await userRepository.findUserById(tokenRecord.userId);
    if (!user) {
      throw new Error('User not found');
    }
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken();

    return { access_token: newAccessToken, refresh_token: newRefreshToken };
  };

}

export const authServices = new AuthServices();
