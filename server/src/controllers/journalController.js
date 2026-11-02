import pool from '../config/database.js';

const USER_ID = 1;

export const getJournalEntries = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM journal_entries WHERE user_id = $1 ORDER BY created_at DESC',
      [USER_ID]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createJournalEntry = async (req, res) => {
  try {
    const { content, prompts } = req.body;
    
    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Content is required' });
    }

    const result = await pool.query(
      `INSERT INTO journal_entries (user_id, content, prompts)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [USER_ID, content, prompts || []]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getJournalEntryById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM journal_entries WHERE id = $1 AND user_id = $2',
      [id, USER_ID]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateJournalEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, prompts } = req.body;

    const result = await pool.query(
      `UPDATE journal_entries 
       SET content = $1, prompts = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [content, prompts || [], id, USER_ID]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteJournalEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM journal_entries WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, USER_ID]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    res.json({ message: 'Journal entry deleted successfully', entry: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

