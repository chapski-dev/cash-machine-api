import { authToken } from 'middleware';
import { cashmachineController } from 'controllers';
import express from "express";
import { validator } from 'utils';

const router = express.Router();

router.get("/history", authToken, cashmachineController.getHistory);
router.get("/balance", authToken, cashmachineController.getBalance);
router.post("/withdraw",authToken, validator.deposit, cashmachineController.withdraw);
router.post("/deposit", authToken,  validator.deposit, cashmachineController.deposit);
router.post("/transfer", authToken, validator.deposit, cashmachineController.transfer);


export default router;
