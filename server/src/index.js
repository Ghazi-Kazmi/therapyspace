import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import moodRoutes from './routes/moodRoutes.js';
import journalRoutes from './routes/journalRoutes.js';
import gratitudeRoutes from './routes/gratitudeRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import emotionRoutes from './routes/emotionRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import meditationRoutes from './routes/meditationRoutes.js';
import preferencesRoutes from './routes/preferencesRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Therapy Space API is running' });
});

// Routes
app.use('/api/mood', moodRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/gratitude', gratitudeRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/emotions', emotionRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/meditation', meditationRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

