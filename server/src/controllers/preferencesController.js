import pool from '../config/database.js';

const USER_ID = 1;

export const getUserPreferences = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM user_preferences WHERE user_id = $1',
      [USER_ID]
    );

    if (result.rows.length === 0) {
      // Create default preferences if they don't exist
      const defaultPrefs = await pool.query(
        `INSERT INTO user_preferences (user_id) 
         VALUES ($1) 
         RETURNING *`,
        [USER_ID]
      );
      return res.json(defaultPrefs.rows[0]);
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserPreferences = async (req, res) => {
  try {
    const { dark_mode, font_size, speech_enabled, onboarded } = req.body;

    const result = await pool.query(
      `UPDATE user_preferences 
       SET dark_mode = COALESCE($1, dark_mode),
           font_size = COALESCE($2, font_size),
           speech_enabled = COALESCE($3, speech_enabled),
           onboarded = COALESCE($4, onboarded),
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $5
       RETURNING *`,
      [dark_mode, font_size, speech_enabled, onboarded, USER_ID]
    );

    if (result.rows.length === 0) {
      // Create preferences if they don't exist
      const newPrefs = await pool.query(
        `INSERT INTO user_preferences (user_id, dark_mode, font_size, speech_enabled, onboarded)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [USER_ID, dark_mode || false, font_size || 'normal', speech_enabled || false, onboarded || false]
      );
      return res.json(newPrefs.rows[0]);
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

