import { DataSource } from 'typeorm';
async function main() {
  const ds = new DataSource({
    type: 'postgres',
    url: 'postgresql://postgres.waeblcermeghvtcramfa:Tripdekho%40123@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres',
    ssl: { rejectUnauthorized: false },
  });
  await ds.initialize();
  const v = await ds.query('SELECT count(*) FROM public.users;');
  console.log('users count:', v);
  const vend = await ds.query('SELECT count(*) FROM public.vendors;');
  console.log('vendors count:', vend);
  const vendRows = await ds.query('SELECT id, "userId" FROM public.vendors LIMIT 5;');
  console.log('vendors rows:', vendRows);
  await ds.destroy();
}
main().catch(console.error);
