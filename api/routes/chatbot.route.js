import express from 'express';
import { askChatbot } from '../controllers/chatbot.controller.js';
import { chatbotLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = express.Router();

router.post('/ask', chatbotLimiter, askChatbot);

export default router;
