export type TransactionType  = 'deposit' | 'withdrawal' | 'transfer';
export type TransactionAction = 'sent' | 'received' | 'deposit' | 'withdrawal';

export interface Transactions {
  type:            TransactionType;
  action:          TransactionAction;
  sender_email:    string | null;
  receiver_email:  string | null;
  amount:          string;
  created_at:      Date;
}