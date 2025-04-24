import { errorHandler } from 'errors';
import { cashmachineService, authServices } from 'services';
import { Request, Response } from "express";
import { SUCCESS_MESSAGES } from 'constants/response-message';

class CashmachineController {

  async getHistory(req: Request, res: Response) {
    try {
      const { email } = req.body.user;
      await authServices.checkEmailExists(email);
      const transactions = await cashmachineService.getHistory(email);
      return res.status(200).json(transactions);
    } catch (error: any) {
      return errorHandler.handleError(error, res);
    }
  }

  async getBalance(req: Request, res: Response) {
    try {
      const { email } = req.body.user;
      await authServices.checkEmailExists(email);
      const balance = await cashmachineService.getBalance(email);
      return res.status(200).json({ balance });
    } catch (error: any) {
      return errorHandler.handleError(error, res);
    }
  }

  async deposit(req: Request, res: Response) {
    try {
      const sender_email = req.body.user.email;
      const { amount } = req.body;
      await authServices.checkEmailExists(sender_email);
      const newBalance = await cashmachineService.deposit(sender_email, amount);
      return res.status(200).json({ message: SUCCESS_MESSAGES.TRANSACTION.DEPOSIT, balance: newBalance });
    } catch (error: any) {
      return errorHandler.handleError(error, res);
    }
  }

  async withdraw(req: Request, res: Response) {
    try {
      const { email } = req.body.user;
      const { amount } = req.body;
      await authServices.checkEmailExists(email);
      const newBalance = await cashmachineService.withdraw(email, amount);
      return res.status(200).json({ message: SUCCESS_MESSAGES.TRANSACTION.WITHDRAWAL, balance: newBalance });
    } catch (error: any) {
      return errorHandler.handleError(error, res);
    }
  }


  async transfer(req: Request, res: Response) {
    try {
      const sender_email = req.body.user.email;
      const { recipient_email, amount } = req.body;
      const newBalance = await cashmachineService.transfer(sender_email, recipient_email, amount);
      return res.status(200).json({ message: SUCCESS_MESSAGES.TRANSACTION.TRANSFER, balance: newBalance });
    } catch (error: any) {
      return errorHandler.handleError(error, res);
    }
  }

}

export const cashmachineController = new CashmachineController();
