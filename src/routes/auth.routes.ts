import { validator } from "utils";
import { authController } from "controllers";
import express from "express";
import { authToken } from "middleware";

const router = express.Router();

router.post("/login", validator.login, authController.login);
router.post("/register", validator.registration, authController.register);
router.post('/check-email', validator.checkEmail, authController.checkEmail);
router.post('/refresh-token', validator.refreshToken, authController.refreshToken);
router.delete('/delete-account', authToken, authController.deleteAccount);



export default router;
