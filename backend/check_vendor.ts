import { DataSource } from 'typeorm';
async function main() {
  const ds = new DataSource({
    type: 'postgres',
    url: 'postgresql://postgres.waeblcermeghvtcramfa:Tripdekho%40123@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres',
    ssl: { rejectUnauthorized: false },
  });
  await ds.initialize();
  const v = await ds.query("SELECT id, user_id FROM public.vendors LIMIT 1;");
  console.log(v);
  await ds.destroy();
}
main().catch(console.error);
