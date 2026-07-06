import { Client } from 'pg';

async function checkUsers() {
  const client = new Client({
    connectionString: "postgresql://postgres.waeblcermeghvtcramfa:Tripdekho%40123@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"
  });

  await client.connect();
  await client.query('ALTER TABLE vendors ADD COLUMN IF NOT EXISTS logo text;');
  console.log("Added logo column to vendors table");
  await client.end();
}

checkUsers().catch(console.error);
