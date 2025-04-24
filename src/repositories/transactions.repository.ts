import pool from 'config/db';
import { PoolClient } from 'pg';
import { TransactionsDB, TransactionsHistory } from 'types/transactions';


class TransactionsRepository {
  async findAllByEmail(email: string): Promise<TransactionsHistory[]> {
    const result = await pool.query<TransactionsDB>(
      `
      SELECT
        type,
        CASE
          WHEN type = 'transfer' AND sender_email   = $1 THEN 'sent'
          WHEN type = 'transfer' AND receiver_email = $1 THEN 'received'
          WHEN type = 'deposit'   AND receiver_email = $1 THEN 'deposit'
          WHEN type = 'withdrawal' AND sender_email   = $1 THEN 'withdrawal'
        END AS action,
        sender_email,
        receiver_email,
        amount,
        created_at
      FROM transactions
      WHERE
        -- include all transactions where you were either the sender or the recipient
        sender_email   = $1
        OR receiver_email = $1
      ORDER BY created_at DESC
      `,
      [email]
    );
  
    return result.rows.map((row) => {
      const base = {
        action:     row.action,
        amount:     parseFloat(row.amount),
        created_at: row.created_at,
      };
  
      if (row.type === 'transfer') {
        return {
          ...base,
          from: row.sender_email   ?? 'Deleted user',
          to:   row.receiver_email ?? 'Deleted user',
        };
      }
  
      return base;
    });
  }  

  async createTransaction(sender_email: string | null, receiver_email: string | null, amount: number, type: TransactionsDB['type'], client: PoolClient) {
    await client.query(
      `INSERT INTO transactions (sender_email, receiver_email, amount, type) VALUES ($1, $2, $3, $4)`,
      [sender_email, receiver_email, amount, type]
    );
  }

}

export const transactionsRepository = new TransactionsRepository();