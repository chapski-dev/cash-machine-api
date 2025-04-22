import { RefreshToken } from 'models';

class RefreshTokenRepository {
  async createRefreshToken (token: string, userId: number, expiresAt: Date) {
    return await RefreshToken.create({ token, userId, expiresAt });
  };
  
  async findRefreshToken (token: string) {
    return await RefreshToken.findOne({ where: { token } });
  };
}

export const refreshTokenRepository = new RefreshTokenRepository()
