import express, { Router } from 'express';
import { LoginUser, userRegistration, verifyUser } from '../controller/auth.controller';


const router: Router = express.Router();

router.post('/user-registration', userRegistration);
router.post('/verify-user', verifyUser);
router.post('/login', LoginUser);

export default router;
  