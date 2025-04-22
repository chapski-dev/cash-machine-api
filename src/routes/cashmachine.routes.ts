import { authToken } from 'middleware';
import { cashmachineController } from 'controllers';
import express from "express";

const router = express.Router();

router.get("/history", authToken, cashmachineController.getHistory);
router.get("/balance", authToken, cashmachineController.getBalance);
router.post("/withdraw",authToken, cashmachineController.withdraw);
router.post("/deposit", authToken, cashmachineController.deposit);
router.post("/transfer", authToken, cashmachineController.transfer);


export default router;
