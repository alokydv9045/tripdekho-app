import { DataSource } from 'typeorm';
async function main() {
  const ds = new DataSource({
    type: 'postgres',
    url: 'postgresql://postgres.waeblcermeghvtcramfa:Tripdekho%40123@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres',
    ssl: { rejectUnauthorized: false },
  });
  await ds.initialize();
  const cols = await ds.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'trips';
  `);
  console.log(cols);
  await ds.destroy();
}
main().catch(console.error);
