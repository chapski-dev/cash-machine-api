import pool from 'config/db';
import { PoolClient } from 'pg';
import { Transacstions } from 'types/transactions';

type TransactionType = 'deposit' | 'withdrawal' | 'transfer' | 'transfer';

class TransactionsRepository {
  async findAllByEmail(email: string): Promise<Transacstions[]> {
    const result = await pool.query(
      `SELECT
      CASE
        WHEN sender_email = $1 AND receiver_email IS NOT NULL THEN 'sent'
        WHEN receiver_email = $1 AND sender_email IS NOT NULL THEN 'received'
        WHEN sender_email = $1 AND receiver_email IS NULL THEN 'withdrawal'
        WHEN receiver_email = $1 AND sender_email IS NULL THEN 'deposit'
      END AS action,
      amount,
      created_at
    FROM transactions
    WHERE sender_email = $1 OR receiver_email = $1
    ORDER BY created_at DESC`,
      [email]
    );
    return result.rows;
  }
  

  async createTransaction(sender_email: string | null, receiver_email: string | null, amount: number, type: TransactionType) {
    await pool.query(
      `INSERT INTO transactions (sender_email, receiver_email, amount, type) VALUES ($1, $2, $3, $4)`,
      [sender_email, receiver_email, amount, type]
    );
  }
  
}

export const transactionsRepository = new TransactionsRepository();