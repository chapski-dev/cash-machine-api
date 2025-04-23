import pool from 'config/db';

class RefreshTokenRepository {
  async createRefreshToken (token: string, user_id: string, expires_at: Date) {
    await pool.query(
      'INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES ($1, $2, $3)',
      [token, user_id, expires_at]
    );
  };
  
  async findRefreshToken (token: string) {
    const result = await pool.query('SELECT * FROM refresh_tokens WHERE token = $1', [token]);
    return result.rows[0];
  };
}

export const refreshTokenRepository = new RefreshTokenRepository()
