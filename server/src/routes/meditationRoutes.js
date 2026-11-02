import express from 'express';
import {
  getMeditationSessions,
  createMeditationSession
} from '../controllers/meditationController.js';

const router = express.Router();

router.get('/', getMeditationSessions);
router.post('/', createMeditationSession);

export default router;

