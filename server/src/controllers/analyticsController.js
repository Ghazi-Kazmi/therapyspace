import pool from '../config/database.js';

const USER_ID = 1;

export const getProgressAnalytics = async (req, res) => {
  try {
    // Get mood entries count
    const moodCount = await pool.query(
      'SELECT COUNT(*) as count FROM mood_entries WHERE user_id = $1',
      [USER_ID]
    );

    // Get journal entries count
    const journalCount = await pool.query(
      'SELECT COUNT(*) as count FROM journal_entries WHERE user_id = $1',
      [USER_ID]
    );

    // Get gratitude entries count
    const gratitudeCount = await pool.query(
      'SELECT COUNT(*) as count FROM gratitude_entries WHERE user_id = $1',
      [USER_ID]
    );

    // Get meditation sessions count
    const meditationCount = await pool.query(
      'SELECT COUNT(*) as count FROM meditation_sessions WHERE user_id = $1',
      [USER_ID]
    );

    // Get total gratitude items
    const gratitudeItemsResult = await pool.query(
      'SELECT items FROM gratitude_entries WHERE user_id = $1',
      [USER_ID]
    );
    const totalGratitudeItems = gratitudeItemsResult.rows.reduce((sum, row) => {
      return sum + (row.items ? row.items.length : 0);
    }, 0);

    res.json({
      moodEntries: parseInt(moodCount.rows[0].count),
      journalEntries: parseInt(journalCount.rows[0].count),
      gratitudeEntries: parseInt(gratitudeCount.rows[0].count),
      totalGratitudeItems,
      meditationSessions: parseInt(meditationCount.rows[0].count)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStreakData = async (req, res) => {
  try {
    // Get mood entries with dates
    const moodEntries = await pool.query(
      `SELECT DATE(created_at) as date 
       FROM mood_entries 
       WHERE user_id = $1 
       ORDER BY date DESC`,
      [USER_ID]
    );

    // Calculate current streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dates = moodEntries.rows.map(row => new Date(row.date));
    const uniqueDates = [...new Set(dates.map(d => d.toISOString().split('T')[0]))].sort().reverse();
    
    if (uniqueDates.length > 0) {
      let expectedDate = new Date(today);
      let index = 0;
      
      // Calculate current streak
      while (index < uniqueDates.length) {
        const entryDate = new Date(uniqueDates[index]);
        entryDate.setHours(0, 0, 0, 0);
        
        if (entryDate.getTime() === expectedDate.getTime()) {
          currentStreak++;
          expectedDate.setDate(expectedDate.getDate() - 1);
          index++;
        } else if (entryDate < expectedDate) {
          break;
        } else {
          index++;
        }
      }

      // Calculate longest streak
      tempStreak = 1;
      for (let i = 1; i < uniqueDates.length; i++) {
        const prevDate = new Date(uniqueDates[i - 1]);
        const currDate = new Date(uniqueDates[i]);
        const diffDays = (prevDate - currDate) / (1000 * 60 * 60 * 24);
        
        if (diffDays === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);
    }

    res.json({
      currentStreak,
      longestStreak,
      totalDays: uniqueDates.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMoodStatistics = async (req, res) => {
  try {
    // Get mood distribution
    const moodDistribution = await pool.query(
      `SELECT mood, COUNT(*) as count 
       FROM mood_entries 
       WHERE user_id = $1 
       GROUP BY mood 
       ORDER BY mood`,
      [USER_ID]
    );

    // Get weekly mood data (last 7 days)
    const weeklyData = await pool.query(
      `SELECT 
         TO_CHAR(created_at, 'Dy') as day,
         AVG(mood) as avg_mood,
         COUNT(*) as count
       FROM mood_entries 
       WHERE user_id = $1 
         AND created_at >= CURRENT_DATE - INTERVAL '7 days'
       GROUP BY TO_CHAR(created_at, 'Dy'), DATE(created_at)
       ORDER BY DATE(created_at) DESC
       LIMIT 7`,
      [USER_ID]
    );

    // Get average mood
    const avgMood = await pool.query(
      'SELECT AVG(mood) as avg_mood FROM mood_entries WHERE user_id = $1',
      [USER_ID]
    );

    res.json({
      distribution: moodDistribution.rows,
      weeklyData: weeklyData.rows,
      averageMood: parseFloat(avgMood.rows[0]?.avg_mood || 0).toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

