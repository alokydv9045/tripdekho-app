import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;

async function run() {
  if (!connectionString) {
    console.error('DATABASE_URL is not defined in .env');
    process.exit(1);
  }

  console.log('Connecting to database...');
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await client.connect();

  try {
    console.log('Checking columns in tripdekho.users table...');
    const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'tripdekho' AND table_name = 'users';
    `);

    const columns = res.rows.map(row => row.column_name);
    console.log('Existing columns:', columns);

    // Add nickname if missing
    if (!columns.includes('nickname')) {
      console.log('Adding nickname column...');
      await client.query('ALTER TABLE tripdekho.users ADD COLUMN nickname VARCHAR(255) NULL;');
    } else {
      console.log('nickname column already exists.');
    }

    // Add avatar if missing
    if (!columns.includes('avatar')) {
      console.log('Adding avatar column...');
      await client.query('ALTER TABLE tripdekho.users ADD COLUMN avatar VARCHAR(255) NULL;');
    } else {
      console.log('avatar column already exists.');
    }

    // Add dateOfBirth if missing
    if (!columns.includes('dateOfBirth')) {
      console.log('Adding dateOfBirth column...');
      await client.query('ALTER TABLE tripdekho.users ADD COLUMN "dateOfBirth" DATE NULL;');
    } else {
      console.log('dateOfBirth column already exists.');
    }

    // Add gender if missing
    if (!columns.includes('gender')) {
      console.log('Adding gender column...');
      await client.query('ALTER TABLE tripdekho.users ADD COLUMN gender VARCHAR(50) NULL;');
    } else {
      console.log('gender column already exists.');
    }

    console.log('Database synchronization completed successfully.');
  } catch (err) {
    console.error('Error synchronizing database schema:', err);
  } finally {
    await client.end();
  }
}

run();
