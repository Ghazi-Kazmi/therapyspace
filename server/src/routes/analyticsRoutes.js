import express from 'express';
import {
  getProgressAnalytics,
  getStreakData,
  getMoodStatistics
} from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/', getProgressAnalytics);
router.get('/streak', getStreakData);
router.get('/mood-stats', getMoodStatistics);

export default router;

