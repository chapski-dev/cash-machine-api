import { Pool } from 'pg';
import * as dotenv from "dotenv";

dotenv.config();

let pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: 5432, // default PostgreSQL port
});

async function setupDatabase() {
  try {
    await pool.query(`
      -- users
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL UNIQUE,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        balance INTEGER NOT NULL DEFAULT 0
      );
    
      -- refresh tokens
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id SERIAL PRIMARY KEY,
        token VARCHAR(255) NOT NULL UNIQUE,
        user_id VARCHAR(255) NOT NULL
          REFERENCES users(user_id) ON DELETE CASCADE,
        expires_at TIMESTAMPTZ NOT NULL
      );
    
      -- transactions
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        sender_email TEXT REFERENCES users(email) ON DELETE SET NULL,
        receiver_email TEXT REFERENCES users(email) ON DELETE SET NULL,
        type TEXT  CHECK (type IN ('deposit','withdrawal','transfer')) NOT NULL,
        amount NUMERIC(12,2) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    
      -- индексы по sender/receiver
      CREATE INDEX IF NOT EXISTS idx_transactions_sender_email
        ON transactions(sender_email);
      CREATE INDEX IF NOT EXISTS idx_transactions_receiver_email
        ON transactions(receiver_email);
    `);
    
    console.log('Таблицы созданы или уже существуют');
  } catch (error) {
    console.error('Ошибка при создании таблиц:', error);
    process.exit(1);
  }
}

setupDatabase();

export default pool;