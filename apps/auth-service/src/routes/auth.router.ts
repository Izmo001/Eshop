import express, { Router } from 'express';
import { LoginUser, userForgotPassword, userRegistration, userResetPassword, verifyUser } from '../controller/auth.controller';
import { verifyForgotPasswordotp } from '../utils/auth.helper';


const router: Router = express.Router();

router.post('/user-registration', userRegistration);
router.post('/verify-user', verifyUser);
router.post('/login', LoginUser);
router.post ("/forgot-password", userForgotPassword);
router.post("/reset-password", userResetPassword); 
router.post("/verify-forgot-password-otp", verifyForgotPasswordotp);

export default router;
  