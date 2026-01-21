import express from "express";
import { register, login, verifyEmail, resendVerificationEmail } from "../controllers/authController.js";

const router = express.Router();
router.post("/login", login);
router.post("/register", register);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);


export default router;
