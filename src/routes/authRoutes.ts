import express, { Request, Response } from 'express';
import { login } from '../controllers/authController';  //  import auth functions

const router = express.Router();

router.post('/login', login);
router.post('/register', login);

export default router;

