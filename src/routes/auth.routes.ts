import { validator } from "utils";
import { authController } from "controllers";
import express from "express";
import { authToken } from "middleware";

const router = express.Router();

router.post("/login", validator.login, authController.login);
router.post("/register", validator.registration, authController.register);
router.post('/check-email', validator.checkEmail, authController.checkEmail);
//@ts-ignore
router.post('/refresh-token', validator.refreshToken, authController.refreshToken);


export default router;
