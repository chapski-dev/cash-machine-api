export type TransactionType = 'deposit' | 'withdrawal' | 'transfer';
export type TransactionAction = 'sent' | 'received' | 'deposit' | 'withdrawal';

export interface TransactionsHistory {
  action: TransactionAction,
  amount: number,
  created_at: Date,
  from?: string
  to?: string
}

export interface TransactionsDB {
  type: TransactionType;
  action: TransactionAction;
  sender_email: string | null;
  receiver_email: string | null;
  amount: string;
  created_at: Date;
}