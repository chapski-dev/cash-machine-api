import { userRepository } from "repositories/user.repository";
import { transactionsRepository } from "repositories/transactions.repository";
import { AppError, HttpCode } from "errors";
import { log } from "console";


export class CashmachineService {
  async getHistory(email: string) {
    return await transactionsRepository.findAllByEmail(email);
  }

  async getBalance(email: string) {
    const account = await userRepository.findUserByEmail(email);
    if (!account) {
      throw new AppError({
        description: 'Account not found',
        httpCode: HttpCode.NOT_FOUND,
      });
    }
    return account.balance;
  }

  //POST
  async withdraw(email: string, amount: number) {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      throw new AppError({
        description: 'Account not found',
        httpCode: HttpCode.NOT_FOUND,
      });
    }
    if (user.balance < amount) {
      throw new AppError({
        description: 'Insufficient funds',
        httpCode: HttpCode.BAD_REQUEST,
      });
    }

    const newBalance = user.balance - amount;
    await userRepository.updateBalance(user.email, newBalance);
    await transactionsRepository.createTransaction(user.email, null, amount, 'withdrawal');
    return newBalance;
  }

  async transfer(sender_email: string, recipient_email: string, amount: number) {
    const senderAccount = await userRepository.findUserByEmail(sender_email);
    const recipientAccount = await userRepository.findUserByEmail(recipient_email);


    if (!senderAccount || !recipientAccount) {
      throw new AppError({
        description: 'User not found',
        httpCode: HttpCode.NOT_FOUND,
      });
    }

    if (senderAccount.balance < amount) {
      throw new AppError({
        description: 'Insufficient funds',
        httpCode: HttpCode.BAD_REQUEST,
      });
    }

    const senderNewBalance = senderAccount.balance - amount;
    const recipientNewBalance = recipientAccount.balance + amount;
    await userRepository.updateBalance(senderAccount.email, senderNewBalance);
    await userRepository.updateBalance(recipientAccount.email, recipientNewBalance);
    await transactionsRepository.createTransaction(senderAccount.email, recipientAccount.email, amount, 'transfer');

    return senderNewBalance;
  }

  async deposit(email: string, amount: number) {
    const account = await userRepository.findUserByEmail(email);
    const newBalance = account.balance + amount;
    await userRepository.updateBalance(account.email, newBalance);
    await transactionsRepository.createTransaction(null, account.email, amount, 'deposit');

    return newBalance;

  }
}

export const cashmachineService = new CashmachineService();
