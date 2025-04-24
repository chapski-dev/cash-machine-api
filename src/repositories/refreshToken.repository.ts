import { PoolClient } from 'pg';
import pool from 'config/db';
import { RefreshTokenDB } from 'types/refresh_tokens';

class RefreshTokenRepository {
  async createRefreshToken (token: string, user_id: string, email: string, expires_at: Date, client?: PoolClient) {
    const bd = client ?? pool
    await bd.query(
      'INSERT INTO refresh_tokens (token, user_id, expires_at, email) VALUES ($1, $2, $3, $4)',
      [token, user_id, expires_at, email]
    );
  };

  async deleteRefreshToken(token: string, client: PoolClient) {
    await client.query('DELETE FROM refresh_tokens WHERE token = $1', [token]);
  }

  async findRefreshToken (token: string, client: PoolClient): Promise<RefreshTokenDB> {
    const result = await client.query('SELECT * FROM refresh_tokens WHERE token = $1', [token]);
    return result.rows[0];
  };
}

export const refreshTokenRepository = new RefreshTokenRepository()
