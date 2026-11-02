-- Therapy Space Database Schema

-- Users table (for future multi-user support, for now we use a default user)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE DEFAULT 'default_user',
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mood entries
CREATE TABLE IF NOT EXISTS mood_entries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) DEFAULT 1,
  mood INTEGER NOT NULL CHECK (mood >= 1 AND mood <= 5),
  emoji VARCHAR(10),
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Journal entries
CREATE TABLE IF NOT EXISTS journal_entries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) DEFAULT 1,
  content TEXT NOT NULL,
  prompts TEXT[], -- Array of prompts
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gratitude entries
CREATE TABLE IF NOT EXISTS gratitude_entries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) DEFAULT 1,
  items TEXT[] NOT NULL, -- Array of gratitude items
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat messages (AI Chatbot)
CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) DEFAULT 1,
  text TEXT NOT NULL,
  sender VARCHAR(20) NOT NULL CHECK (sender IN ('user', 'bot')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emotion wheel entries
CREATE TABLE IF NOT EXISTS emotion_entries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) DEFAULT 1,
  category VARCHAR(50) NOT NULL,
  emotion VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Self-care reminders
CREATE TABLE IF NOT EXISTS reminders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) DEFAULT 1,
  title VARCHAR(255) NOT NULL,
  time VARCHAR(10) NOT NULL, -- Time in HH:MM format
  icon VARCHAR(50) DEFAULT 'Bell',
  enabled BOOLEAN DEFAULT true,
  frequency VARCHAR(20) DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekdays', 'weekends')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meditation sessions (Calm Zone)
CREATE TABLE IF NOT EXISTS meditation_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) DEFAULT 1,
  duration INTEGER NOT NULL, -- Duration in seconds
  type VARCHAR(50) DEFAULT 'meditation', -- meditation, breathing, etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) DEFAULT 1 UNIQUE,
  dark_mode BOOLEAN DEFAULT false,
  font_size VARCHAR(20) DEFAULT 'normal',
  speech_enabled BOOLEAN DEFAULT false,
  onboarded BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Achievements (for tracking user achievements)
CREATE TABLE IF NOT EXISTS user_achievements (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) DEFAULT 1,
  achievement_id VARCHAR(100) NOT NULL,
  unlocked BOOLEAN DEFAULT false,
  progress INTEGER DEFAULT 0,
  unlocked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, achievement_id)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_created ON mood_entries(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_created ON journal_entries(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gratitude_entries_user_created ON gratitude_entries(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_created ON chat_messages(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_emotion_entries_user_created ON emotion_entries(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reminders_user ON reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_meditation_sessions_user_created ON meditation_sessions(user_id, created_at DESC);

