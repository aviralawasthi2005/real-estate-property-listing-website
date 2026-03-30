import express from 'express';
import { getMessages, sendMessage, getConversations } from '../controllers/message.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/conversations', verifyToken, getConversations);
router.get('/:otherUserId', verifyToken, getMessages);
router.post('/', verifyToken, sendMessage);

export default router;
