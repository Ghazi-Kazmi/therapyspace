# Therapy Space - Backend Setup Instructions

This document provides step-by-step instructions to set up the backend server and connect it to the frontend.

## Prerequisites

1. **PostgreSQL Database** - Make sure PostgreSQL is installed and running
2. **Node.js** - Version 18 or higher
3. **Database Connection** - The database should be accessible at: `postgresql://postgres:9596@localhost:5432/therapy-space`

## Backend Setup

### Step 1: Navigate to Server Directory
```bash
cd server
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create Database
Make sure your PostgreSQL database `therapy-space` exists. If not, create it:
```sql
CREATE DATABASE "therapy-space";
```

### Step 4: Run Database Migrations
```bash
npm run migrate
```

This will create all necessary tables in the database.

### Step 5: Start the Backend Server
```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

The server should start on `http://localhost:5000`

## Frontend Setup

### Step 1: Create Environment Variable (Optional)
Create a `.env` file in the root directory (if you want to change the API URL):
```
VITE_API_URL=http://localhost:5000/api
```

If you don't create this file, it will default to `http://localhost:5000/api`.

### Step 2: Install Frontend Dependencies (if not already done)
```bash
npm install
```

### Step 3: Start the Frontend
```bash
npm run dev
```

The frontend should start on `http://localhost:3000`

## Verification

1. **Check Backend Health**: Visit `http://localhost:5000/health` - should return `{"status":"ok","message":"Therapy Space API is running"}`

2. **Test Frontend Connection**: Open the frontend app and try creating a mood entry or journal entry. It should save to the database.

## Database Schema

The following tables are created:
- `users` - User accounts (default user ID: 1)
- `mood_entries` - Mood tracking entries
- `journal_entries` - Journal entries
- `gratitude_entries` - Gratitude journal entries
- `chat_messages` - AI chatbot messages
- `emotion_entries` - Emotion wheel entries
- `reminders` - Self-care reminders
- `meditation_sessions` - Meditation session records
- `user_preferences` - User preferences (dark mode, font size, etc.)
- `user_achievements` - User achievements (for future use)

## API Endpoints

All API endpoints are prefixed with `/api`:

- **Mood**: `/api/mood` (GET, POST, DELETE)
- **Journal**: `/api/journal` (GET, POST, PUT, DELETE)
- **Gratitude**: `/api/gratitude` (GET, POST, DELETE)
- **Chat**: `/api/chat` (GET, POST, DELETE)
- **Emotions**: `/api/emotions` (GET, POST, DELETE)
- **Reminders**: `/api/reminders` (GET, POST, PUT, PATCH, DELETE)
- **Meditation**: `/api/meditation` (GET, POST)
- **Preferences**: `/api/preferences` (GET, PUT)
- **Analytics**: `/api/analytics` (GET)

See `server/README.md` for detailed API documentation.

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check database credentials in the connection string
- Ensure the database `therapy-space` exists

### Port Already in Use
- Change the PORT in `server/.env` or `server/src/index.js`
- Update `VITE_API_URL` in frontend `.env` accordingly

### CORS Errors
- The backend has CORS enabled for all origins
- If issues persist, check that the backend is running on the correct port

### Migration Errors
- Ensure you have proper permissions to create tables
- Check PostgreSQL logs for detailed error messages
- Make sure the database exists before running migrations

## Next Steps

After setup, all user data (mood entries, journal entries, gratitude entries, etc.) will be stored in the PostgreSQL database instead of browser local storage. The data persists across sessions and browser changes.

