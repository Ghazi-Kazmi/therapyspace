import express from 'express';
import {
  getMoodEntries,
  createMoodEntry,
  getMoodEntryById,
  deleteMoodEntry
} from '../controllers/moodController.js';

const router = express.Router();

router.get('/', getMoodEntries);
router.post('/', createMoodEntry);
router.get('/:id', getMoodEntryById);
router.delete('/:id', deleteMoodEntry);

export default router;

