# Therapy Space - Backend Integration Summary

## What Was Built

A complete Node.js + Express.js backend server with PostgreSQL database integration for the Therapy Space application.

## Backend Structure

```
server/
├── src/
│   ├── config/
│   │   ├── database.js          # PostgreSQL connection
│   │   ├── schema.sql           # Database schema
│   │   └── migrate.js           # Migration script
│   ├── controllers/             # Business logic
│   │   ├── moodController.js
│   │   ├── journalController.js
│   │   ├── gratitudeController.js
│   │   ├── chatController.js
│   │   ├── emotionController.js
│   │   ├── reminderController.js
│   │   ├── meditationController.js
│   │   ├── preferencesController.js
│   │   └── analyticsController.js
│   ├── routes/                  # API routes
│   │   ├── moodRoutes.js
│   │   ├── journalRoutes.js
│   │   ├── gratitudeRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── emotionRoutes.js
│   │   ├── reminderRoutes.js
│   │   ├── meditationRoutes.js
│   │   ├── preferencesRoutes.js
│   │   └── analyticsRoutes.js
│   └── index.js                 # Main server file
├── package.json
└── README.md
```

## Frontend Changes

### New Files
- `src/services/api.js` - API service layer for all backend calls

### Updated Components
- `components/MoodTracker.tsx` - Now uses backend API
- `components/Journal.tsx` - Now uses backend API
- `components/GratitudeJournal.tsx` - Now uses backend API
- `components/AIChatbot.tsx` - Now uses backend API
- `components/EmotionWheel.tsx` - Now uses backend API
- `components/SelfCareReminders.tsx` - Now uses backend API
- `App.tsx` - Preferences now stored in backend

## Database Schema

All user data is stored in PostgreSQL:

1. **mood_entries** - Mood tracking entries (mood value, emoji, note, timestamp)
2. **journal_entries** - Journal entries (content, prompts, timestamp)
3. **gratitude_entries** - Gratitude journal entries (items array, timestamp)
4. **chat_messages** - AI chatbot messages (text, sender, timestamp)
5. **emotion_entries** - Emotion wheel entries (category, emotion, timestamp)
6. **reminders** - Self-care reminders (title, time, icon, enabled, frequency)
7. **meditation_sessions** - Meditation session records (duration, type, timestamp)
8. **user_preferences** - User preferences (dark_mode, font_size, speech_enabled, onboarded)
9. **users** - User accounts (for future multi-user support)
10. **user_achievements** - User achievements (for future use)

## Quick Start

1. **Start PostgreSQL** - Ensure PostgreSQL is running

2. **Setup Backend**:
   ```bash
   cd server
   npm install
   npm run migrate
   npm run dev
   ```

3. **Start Frontend** (in a separate terminal):
   ```bash
   npm run dev
   ```

4. **Access Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

## API Base URL

Default: `http://localhost:5000/api`

Can be customized by setting `VITE_API_URL` in frontend `.env` file.

## Features Integrated

✅ Mood Tracking
✅ Journal Entries
✅ Gratitude Journal
✅ AI Chatbot
✅ Emotion Wheel
✅ Self-Care Reminders
✅ User Preferences (dark mode, font size, speech, onboarding)
✅ Analytics Data (available via API, can be integrated into ProgressAnalytics component)

## Next Steps (Optional Enhancements)

1. Update `ProgressAnalytics.tsx` to use analytics API endpoints
2. Update `CalmZone.tsx` to save meditation sessions
3. Add authentication for multi-user support
4. Add data export functionality
5. Add data backup/restore features

## Notes

- All data now persists in PostgreSQL instead of browser localStorage
- The application uses a default user (ID: 1) for single-user mode
- CORS is enabled for development (allows frontend to connect)
- Error handling is implemented throughout the API

