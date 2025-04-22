
import express from "express";
import authRoutes from './auth.routes'
import cashmachineRoutes from './cashmachine.routes'

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/cashmachine', cashmachineRoutes);

export default router;