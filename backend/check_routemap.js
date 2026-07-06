const { DataSource } = require('typeorm');
async function main() {
  const ds = new DataSource({
    type: 'postgres',
    url: 'postgresql://postgres.waeblcermeghvtcramfa:Tripdekho%40123@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres',
    ssl: { rejectUnauthorized: false },
  });
  await ds.initialize();
  const trips = await ds.query('SELECT title, thumbnail, "routeMapImage" FROM tripdekho.trips LIMIT 3;');
  console.log(trips);
  await ds.destroy();
}
main().catch(console.error);
