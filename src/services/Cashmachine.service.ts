import { Transaction } from "models";
import { User } from "models";

export class CashmachineService {
  async getHistory(email: string) {
    return await Transaction.findAll({ where: { email } });
  }

  async getBalance(email: string) {
    const account = await User.findOne({ where: { email } });
    if (!account) {
      throw new Error('Account not found');
    }
    return account.balance;
  }
    
  //POST
  async withdraw(email: string, amount: number) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Account not found');
    }
    if (user.balance < amount) {
      throw new Error('Insufficient funds');
    }
    user.balance -= amount;
    await user.save();
    //@ts-ignore
    await Transaction.create({ email, type: 'withdraw', amount, timestamp: new Date() });
    return user.balance;
  }

  async transfer(sender_email: string, recipient_email: string, amount: number) {
    const senderAccount = await User.findOne({ where: { email: sender_email } });
    const recipientAccount = await User.findOne({ where: { email: recipient_email } });
    if (!senderAccount || !recipientAccount) {
      throw new Error('User not found');
    }
    if (senderAccount.balance < amount) {
      throw new Error('Insufficient funds');
    }
    senderAccount.balance -= amount;
    recipientAccount.balance += amount;
    await senderAccount.save();
    await recipientAccount.save();
    //@ts-ignore
    await Transaction.create({ email: sender_email, type: 'transfer', amount, recipient_email, timestamp: new Date()  });
    return senderAccount.balance;

  }

  async deposit(email: string, amount: number) {
    const account = await User.findOne({ where: { email } });
    if (!account) {
      throw new Error('Account not found');
    }
    account.balance += amount;
    await account.save();
    //@ts-ignore
    await Transaction.create({ email, type: 'deposit', amount, timestamp: new Date() });
    return account.balance;
  }
}

export const cashmachineService = new CashmachineService();
