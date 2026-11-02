import express from 'express';
import {
  getJournalEntries,
  createJournalEntry,
  getJournalEntryById,
  updateJournalEntry,
  deleteJournalEntry
} from '../controllers/journalController.js';

const router = express.Router();

router.get('/', getJournalEntries);
router.post('/', createJournalEntry);
router.get('/:id', getJournalEntryById);
router.put('/:id', updateJournalEntry);
router.delete('/:id', deleteJournalEntry);

export default router;

