import pool from '../config/database.js';

const USER_ID = 1;

export const getReminders = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM reminders WHERE user_id = $1 ORDER BY time ASC',
      [USER_ID]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createReminder = async (req, res) => {
  try {
    const { title, time, icon, enabled, frequency } = req.body;
    
    if (!title || !time) {
      return res.status(400).json({ error: 'Title and time are required' });
    }

    const result = await pool.query(
      `INSERT INTO reminders (user_id, title, time, icon, enabled, frequency)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [USER_ID, title, time, icon || 'Bell', enabled !== undefined ? enabled : true, frequency || 'daily']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, time, icon, enabled, frequency } = req.body;

    const result = await pool.query(
      `UPDATE reminders 
       SET title = COALESCE($1, title),
           time = COALESCE($2, time),
           icon = COALESCE($3, icon),
           enabled = COALESCE($4, enabled),
           frequency = COALESCE($5, frequency),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [title, time, icon, enabled, frequency, id, USER_ID]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reminder not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const toggleReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE reminders 
       SET enabled = NOT enabled, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, USER_ID]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reminder not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM reminders WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, USER_ID]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reminder not found' });
    }

    res.json({ message: 'Reminder deleted successfully', reminder: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

