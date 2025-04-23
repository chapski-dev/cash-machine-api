import pool from 'config/db';
import { IUser } from 'types';
import { v4 as uuidv4 } from 'uuid';

class UserRepository {
  async findUserById (id: number): Promise<IUser> {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  };

  async findUserByEmail (email: string):  Promise<IUser> {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  };
  
  async createUser (username: string, email: string, password: string):Promise<IUser> {
    const user_id = uuidv4();
    const balance = 0;
    const result = await pool.query(
      'INSERT INTO users (user_id, username, email, password, balance) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, username, email, password, balance]
    );
    return result.rows[0];
  };

  async updateBalance(email: string, balance: number) {
    await pool.query('UPDATE users SET balance = $1 WHERE email = $2', [balance, email]);
  }

   async deleteUser (email: string) {
    const result = await pool.query(
      'DELETE FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  };
}

export const userRepository = new UserRepository();