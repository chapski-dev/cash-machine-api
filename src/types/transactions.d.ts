export interface Transacstions {
  id: number;
  email: string;
  type: string;
  amount: number;
  recipient_email?: string;
  timestamp: Date;
}