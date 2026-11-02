import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  try {
    console.log('Running database migrations...');
    
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    await pool.query(schema);
    
    // Create default user if it doesn't exist
    await pool.query(`
      INSERT INTO users (id, username) 
      VALUES (1, 'default_user') 
      ON CONFLICT (username) DO NOTHING;
    `);
    
    // Create default user preferences if they don't exist
    await pool.query(`
      INSERT INTO user_preferences (user_id) 
      VALUES (1) 
      ON CONFLICT (user_id) DO NOTHING;
    `);
    
    console.log('✅ Database migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();

