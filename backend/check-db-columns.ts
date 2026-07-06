import { DataSource } from 'typeorm';

async function main() {
  const ds = new DataSource({
    type: 'postgres',
    url: 'postgresql://postgres.waeblcermeghvtcramfa:Tripdekho%40123@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres',
    ssl: { rejectUnauthorized: false },
  });
  await ds.initialize();

  console.log('=== ADDING DUMMY COLUMNS FOR TYPEORM ===');

  try {
    await ds.query(`ALTER TABLE "tripdekho"."vendors" ADD COLUMN IF NOT EXISTS "website" character varying;`);
    console.log('✅ Added website to vendors');
  } catch (e: any) {
    console.log(`⚠ Error: ${e.message}`);
  }

  await ds.destroy();
}

main().catch(e => { console.error(e); process.exit(1); });
