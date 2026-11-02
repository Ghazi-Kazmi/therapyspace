import express from 'express';
import {
  getGratitudeEntries,
  createGratitudeEntry,
  getGratitudeEntryById,
  deleteGratitudeEntry
} from '../controllers/gratitudeController.js';

const router = express.Router();

router.get('/', getGratitudeEntries);
router.post('/', createGratitudeEntry);
router.get('/:id', getGratitudeEntryById);
router.delete('/:id', deleteGratitudeEntry);

export default router;

