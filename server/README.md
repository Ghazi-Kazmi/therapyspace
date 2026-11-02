# Therapy Space Backend Server

Node.js + Express.js backend server with PostgreSQL database for the Therapy Space application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (or use the provided connection string):
```
DATABASE_URL=postgresql://postgres:9596@localhost:5432/therapy-space
PORT=5000
NODE_ENV=development
```

3. Run database migrations:
```bash
npm run migrate
```

4. Start the server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /health` - Server health check

### Mood Tracking
- `GET /api/mood` - Get all mood entries
- `POST /api/mood` - Create a mood entry
- `GET /api/mood/:id` - Get a specific mood entry
- `DELETE /api/mood/:id` - Delete a mood entry

### Journal
- `GET /api/journal` - Get all journal entries
- `POST /api/journal` - Create a journal entry
- `GET /api/journal/:id` - Get a specific journal entry
- `PUT /api/journal/:id` - Update a journal entry
- `DELETE /api/journal/:id` - Delete a journal entry

### Gratitude
- `GET /api/gratitude` - Get all gratitude entries
- `POST /api/gratitude` - Create a gratitude entry
- `GET /api/gratitude/:id` - Get a specific gratitude entry
- `DELETE /api/gratitude/:id` - Delete a gratitude entry

### Chat (AI Chatbot)
- `GET /api/chat` - Get all chat messages
- `POST /api/chat` - Create a chat message (user message will auto-generate bot response)
- `DELETE /api/chat/:id` - Delete a chat message
- `DELETE /api/chat` - Clear all chat history

### Emotions
- `GET /api/emotions` - Get all emotion entries
- `POST /api/emotions` - Create an emotion entry
- `GET /api/emotions/:id` - Get a specific emotion entry
- `DELETE /api/emotions/:id` - Delete an emotion entry

### Reminders
- `GET /api/reminders` - Get all reminders
- `POST /api/reminders` - Create a reminder
- `PUT /api/reminders/:id` - Update a reminder
- `PATCH /api/reminders/:id/toggle` - Toggle reminder enabled/disabled
- `DELETE /api/reminders/:id` - Delete a reminder

### Meditation
- `GET /api/meditation` - Get all meditation sessions
- `POST /api/meditation` - Create a meditation session

### Preferences
- `GET /api/preferences` - Get user preferences
- `PUT /api/preferences` - Update user preferences

### Analytics
- `GET /api/analytics` - Get progress analytics
- `GET /api/analytics/streak` - Get streak data
- `GET /api/analytics/mood-stats` - Get mood statistics

## Database Schema

The database includes the following tables:
- `users` - User accounts
- `mood_entries` - Mood tracking entries
- `journal_entries` - Journal entries
- `gratitude_entries` - Gratitude journal entries
- `chat_messages` - AI chatbot messages
- `emotion_entries` - Emotion wheel entries
- `reminders` - Self-care reminders
- `meditation_sessions` - Meditation session records
- `user_preferences` - User preferences (dark mode, font size, etc.)
- `user_achievements` - User achievements (for future use)

## Technologies

- Node.js
- Express.js
- PostgreSQL
- pg (PostgreSQL client)

