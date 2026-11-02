import pool from '../config/database.js';

const USER_ID = 1; // Default user ID

export const getMoodEntries = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM mood_entries WHERE user_id = $1 ORDER BY created_at DESC',
      [USER_ID]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createMoodEntry = async (req, res) => {
  try {
    const { mood, emoji, note } = req.body;
    
    if (!mood || mood < 1 || mood > 5) {
      return res.status(400).json({ error: 'Mood must be between 1 and 5' });
    }

    const result = await pool.query(
      `INSERT INTO mood_entries (user_id, mood, emoji, note)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [USER_ID, mood, emoji || null, note || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMoodEntryById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM mood_entries WHERE id = $1 AND user_id = $2',
      [id, USER_ID]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mood entry not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMoodEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM mood_entries WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, USER_ID]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mood entry not found' });
    }

    res.json({ message: 'Mood entry deleted successfully', entry: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

