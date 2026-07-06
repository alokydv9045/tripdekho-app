import { DataSource } from 'typeorm';

const ds = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: 'tripdekho',
  synchronize: false,
});

async function run() {
  await ds.initialize();
  const res = await ds.query('SELECT "verificationStatus", COUNT(*) FROM vendors GROUP BY "verificationStatus"');
  console.log(res);
  process.exit(0);
}
run();
