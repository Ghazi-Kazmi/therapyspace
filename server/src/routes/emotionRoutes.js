import express from 'express';
import {
  getEmotionEntries,
  createEmotionEntry,
  getEmotionEntryById,
  deleteEmotionEntry
} from '../controllers/emotionController.js';

const router = express.Router();

router.get('/', getEmotionEntries);
router.post('/', createEmotionEntry);
router.get('/:id', getEmotionEntryById);
router.delete('/:id', deleteEmotionEntry);

export default router;

