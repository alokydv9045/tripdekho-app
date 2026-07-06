const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL
});
async function run() {
  await client.connect();
  try {
    await client.query('ALTER TABLE tripdekho.users ADD COLUMN avatar jsonb;');
    console.log("Added avatar to users");
  } catch (e) { console.log(e.message); }
  
  try {
    await client.query('ALTER TABLE tripdekho.vendors ADD COLUMN logo jsonb;');
    console.log("Added logo to vendors");
  } catch (e) { console.log(e.message); }
  
  console.log("Done!");
  process.exit(0);
}
run().catch(console.error);
