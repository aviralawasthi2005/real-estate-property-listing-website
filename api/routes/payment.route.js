import express from 'express';
import { createCheckoutSession, verifyCheckoutSession } from '../controllers/payment.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create-checkout-session', verifyToken, createCheckoutSession);
router.post('/verify-session', verifyToken, verifyCheckoutSession);

export default router;
