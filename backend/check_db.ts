import { Client } from 'pg';
const client = new Client({ connectionString: 'postgresql://postgres.waeblcermeghvtcramfa:Tripdekho%40123@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres' });
client.connect().then(async () => {
  const res = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'vendors'");
  console.log(res.rows.map(r => r.column_name).includes('kycDocuments'));
  client.end();
});
