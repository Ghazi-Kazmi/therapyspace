import express from 'express';
import { getAIQuote, getAIAffirmation } from '../controllers/aiController.js';

const router = express.Router();

router.get('/quote', getAIQuote);
router.get('/affirmation', getAIAffirmation);

export default router;
