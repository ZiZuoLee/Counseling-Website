import express from 'express';
import { auth } from '../middleware/auth';
import {
  createChat,
  getChats,
  getChatMessages,
  sendMessage,
} from '../controllers/chat';

const router = express.Router();

// All routes are protected
router.use(auth);

// Create new chat
router.post('/', createChat);

// Get user's chats
router.get('/', getChats);

// Get chat messages
router.get('/:chatId/messages', getChatMessages);

// Send message
router.post('/:chatId/messages', sendMessage);

export default router; 