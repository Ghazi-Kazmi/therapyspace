import express from 'express';
import {
  getUserPreferences,
  updateUserPreferences
} from '../controllers/preferencesController.js';

const router = express.Router();

router.get('/', getUserPreferences);
router.put('/', updateUserPreferences);

export default router;

