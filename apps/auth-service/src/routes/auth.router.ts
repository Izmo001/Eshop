import express, { Router } from 'express';
//eslint-disable-next-line @nx/enforce-module-boundaries
import { userRegistration } from "../../src/controller/auth.controller";

const router:Router = express.Router();
router.post('/user-registration', userRegistration);

export default router;