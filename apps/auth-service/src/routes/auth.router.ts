import express, { Router } from 'express';
import { userRegistration, verifyUser, userLogin } from '../controller/auth.controller';

const router:Router = express.Router();
router.post('/user-registration', userRegistration);
router.post('/verify-user', verifyUser);
router.post('/login', userLogin);

export default router;