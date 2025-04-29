import { userRepository } from "repositories/user.repository";
import { transactionsRepository } from "repositories/transactions.repository";
import { AppError } from "errors";
import pool from "config/db";
import { ERROR_MESSAGES } from "constants/error-message";
import { HttpCode } from "constants/http";

export class CashmachineService {

  async getHistory(email: string) {
    return await transactionsRepository.findAllByEmail(email);
  }

  async getBalance(email: string) {
    const account = await userRepository.findUserByEmail(email);
    if (!account) {
      throw new AppError({
        description: ERROR_MESSAGES.USER.NOT_FOUND,
        httpCode: HttpCode.NOT_FOUND,
      });
    }
    return account.balance;
  }

  async withdraw(email: string, amount: number) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const user = await userRepository.findUserByEmail(email);
      if (!user) {
        throw new AppError({
          description: ERROR_MESSAGES.USER.NOT_FOUND,
          httpCode: HttpCode.NOT_FOUND,
        });
      }
      if (user.balance < amount) {
        throw new AppError({
          description: ERROR_MESSAGES.TRANSACTION.INSUFFICIENT_FUNDS,
          httpCode: HttpCode.BAD_REQUEST,
        });
      }

      const newBalance = await userRepository.subtractFunds(user.email, amount, client);
      await transactionsRepository.createTransaction(user.email, null, amount, 'withdrawal', client);

      await client.query("COMMIT");

      return newBalance;

    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async transfer(sender_email: string, recipient_email: string, amount: number) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const [senderAccount, recipientAccount] = await Promise.all([
        userRepository.findUserByEmail(sender_email),
        userRepository.findUserByEmail(recipient_email)
      ]);

      if (!recipientAccount || !senderAccount) {
        throw new AppError({
          description: ERROR_MESSAGES.USER.NOT_FOUND,
          httpCode: HttpCode.NOT_FOUND,
        });
      }

      if (sender_email === recipient_email) {
        throw new AppError({
          description: ERROR_MESSAGES.USER.SELF_TRANSFER,
          httpCode: HttpCode.FORBIDDEN,
        });
      }

      if (senderAccount.balance < amount) {
        throw new AppError({
          description: ERROR_MESSAGES.TRANSACTION.INSUFFICIENT_FUNDS,
          httpCode: HttpCode.BAD_REQUEST,
        });
      }

      const senderNewBalance = await userRepository.subtractFunds(senderAccount.email, amount, client);
      await userRepository.depositFunds(recipientAccount.email, amount, client);

      await transactionsRepository.createTransaction(senderAccount.email, recipientAccount.email, amount, 'transfer', client);

      await client.query("COMMIT");

      return senderNewBalance;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }

  }

  async deposit(email: string, amount: number) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const account = await userRepository.findUserByEmail(email);
      if (!account) {
        throw new AppError({
          description: ERROR_MESSAGES.USER.NOT_FOUND,
          httpCode: HttpCode.NOT_FOUND,
        });
      }
      const newBalance = await userRepository.depositFunds(account.email, amount, client);
      await transactionsRepository.createTransaction(null, account.email, amount, 'deposit', client);

      await client.query("COMMIT");

      return newBalance;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
}

export const cashmachineService = new CashmachineService();
