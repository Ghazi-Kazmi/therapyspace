import pool from '../config/database.js';

const USER_ID = 1;

export const getEmotionEntries = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM emotion_entries WHERE user_id = $1 ORDER BY created_at DESC',
      [USER_ID]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createEmotionEntry = async (req, res) => {
  try {
    const { category, emotion } = req.body;
    
    if (!category || !emotion) {
      return res.status(400).json({ error: 'Category and emotion are required' });
    }

    const result = await pool.query(
      `INSERT INTO emotion_entries (user_id, category, emotion)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [USER_ID, category, emotion]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEmotionEntryById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM emotion_entries WHERE id = $1 AND user_id = $2',
      [id, USER_ID]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Emotion entry not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteEmotionEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM emotion_entries WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, USER_ID]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Emotion entry not found' });
    }

    res.json({ message: 'Emotion entry deleted successfully', entry: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

