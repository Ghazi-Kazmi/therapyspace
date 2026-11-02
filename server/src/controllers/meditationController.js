import pool from '../config/database.js';

const USER_ID = 1;

export const getMeditationSessions = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM meditation_sessions WHERE user_id = $1 ORDER BY created_at DESC',
      [USER_ID]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createMeditationSession = async (req, res) => {
  try {
    const { duration, type } = req.body;
    
    if (!duration || duration < 0) {
      return res.status(400).json({ error: 'Duration must be a positive number' });
    }

    const result = await pool.query(
      `INSERT INTO meditation_sessions (user_id, duration, type)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [USER_ID, duration, type || 'meditation']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

