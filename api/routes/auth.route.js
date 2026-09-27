import express from 'express';
import { google, signOut, signin, signup } from '../controllers/auth.controller.js';
import { authLimiter } from '../middlewares/rateLimiter.middleware.js';
import { validateSignup, validateSignin } from '../middlewares/validation.middleware.js';

const router = express.Router();

router.post('/signup', authLimiter, validateSignup, signup);
router.post('/signin', authLimiter, validateSignin, signin);
router.post('/google', authLimiter, google);
router.get('/signout', signOut);

export default router;