import pool from 'config/db';
import { AppError, HttpCode } from 'errors';
import { PoolClient } from 'pg';
import { IUser } from 'types/users';
import { v4 as uuidv4 } from 'uuid';

class UserRepository {
  async findUserById(id: number): Promise<IUser> {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  };

  async findUserByUserId(id: string): Promise<IUser> {
    const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
    return result.rows[0];
  };

  async findUserByEmail(email: string, client?: PoolClient): Promise<IUser> {
    const bd = client ?? pool
    const result = await bd.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  };


  async createUser(username: string, email: string, password: string): Promise<IUser> {
    const user_id = uuidv4();
    const balance = 0;
    const result = await pool.query(
      'INSERT INTO users (user_id, username, email, password, balance) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, username, email, password, balance]
    );
    return result.rows[0];
  };

  async deleteUser(email: string) {
    const result = await pool.query(`DELETE FROM users WHERE email = $1`, [email]);
    if (result.rowCount === 0) {
      throw new AppError({
        description: "User not found",
        httpCode: HttpCode.NOT_FOUND,
      });
    }
  };

  /** top up user balance */
  async depositFunds(email: string, amount: number, client: PoolClient) {
    const res = await client.query(`UPDATE users
      SET balance = balance + $1
      WHERE email = $2
      RETURNING balance`, [amount, email]);

    return res.rows[0].balance
  }

  /** reduce user balance */
  async subtractFunds(email: string, amount: number, client: PoolClient) {
    const res = await client.query(`UPDATE users 
      SET balance = balance - $1 
      WHERE email = $2 AND balance >= $1
      RETURNING balance`, [amount, email]);

    return res.rows[0].balance
  }
}

export const userRepository = new UserRepository();