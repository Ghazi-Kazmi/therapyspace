import express from 'express';
import {
  getChatMessages,
  createChatMessage,
  deleteChatMessage,
  clearChatHistory
} from '../controllers/chatController.js';

const router = express.Router();

router.get('/', getChatMessages);
router.post('/', createChatMessage);
router.delete('/:id', deleteChatMessage);
router.delete('/', clearChatHistory);

export default router;

