import { HttpCode, errorHandler } from 'errors';
import { cashmachineService } from 'services';
import { Request, Response } from "express";
import { validateRequest } from 'utils/validator';
import { validationResult } from 'express-validator';

class CashmachineController {
  async getHistory(req: Request, res: Response) {
    const validationErrors = validationResult(req);
    try {
      validateRequest(validationErrors, {
        description: "Not valid data.",
        httpCode: HttpCode.BAD_REQUEST,
      });

      const { email } = req.body.user;
      const transactions = await cashmachineService.getHistory(email);
      return res.status(200).json({ transactions });
    } catch (error: any) {
      return errorHandler.handleError(error, res, validationErrors);
    }
  }

  async getBalance(req: Request, res: Response) {
    const validationErrors = validationResult(req);
    try {
      validateRequest(validationErrors, {
        description: "Not valid data.",
        httpCode: HttpCode.BAD_REQUEST,
      });
      const { email } = req.body.user;
      const balance = await cashmachineService.getBalance(email);
      return res.status(200).json({ balance });
    } catch (error: any) {
      return errorHandler.handleError(error, res, validationErrors);
    }
  }

  async deposit(req: Request, res: Response) {
    try {
      const sender_email = req.body.user.email;
      const { amount } = req.body;
      const newBalance = await cashmachineService.deposit(sender_email, amount);
      return res.status(200).json({ message: 'Deposit successful', balance: newBalance });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  }

  async withdraw(req: Request, res: Response) {
    try {
      const sender_email = req.body.user.email;
      const { amount } = req.body;
      const newBalance = await cashmachineService.withdraw(sender_email, amount);
      return res.status(200).json({ message: 'Withdrawal successful', balance: newBalance });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  }

  async transfer(req: Request, res: Response) {
    try {
      const sender_email = req.body.user.email;
      const { recipient_email, amount } = req.body;
      const newBalance = await cashmachineService.transfer(sender_email, recipient_email, amount);
      return res.status(200).json({ message: 'Transfer successful', balance: newBalance });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  }

}

export const cashmachineController = new CashmachineController();
