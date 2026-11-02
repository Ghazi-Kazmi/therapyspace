import express from 'express';
import {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder,
  toggleReminder
} from '../controllers/reminderController.js';

const router = express.Router();

router.get('/', getReminders);
router.post('/', createReminder);
router.put('/:id', updateReminder);
router.patch('/:id/toggle', toggleReminder);
router.delete('/:id', deleteReminder);

export default router;

