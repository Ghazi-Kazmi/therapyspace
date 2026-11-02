import pool from '../config/database.js';

const USER_ID = 1;

export const getGratitudeEntries = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM gratitude_entries WHERE user_id = $1 ORDER BY created_at DESC',
      [USER_ID]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createGratitudeEntry = async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array is required and must not be empty' });
    }

    const filteredItems = items.filter(item => item.trim() !== '');
    if (filteredItems.length === 0) {
      return res.status(400).json({ error: 'At least one non-empty item is required' });
    }

    const result = await pool.query(
      `INSERT INTO gratitude_entries (user_id, items)
       VALUES ($1, $2)
       RETURNING *`,
      [USER_ID, filteredItems]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getGratitudeEntryById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM gratitude_entries WHERE id = $1 AND user_id = $2',
      [id, USER_ID]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Gratitude entry not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteGratitudeEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM gratitude_entries WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, USER_ID]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Gratitude entry not found' });
    }

    res.json({ message: 'Gratitude entry deleted successfully', entry: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

