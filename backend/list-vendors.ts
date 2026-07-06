import { DataSource } from "typeorm";
import { config } from "dotenv";

config();

const dataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  schema: "tripdekho",
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await dataSource.initialize();
  const vendors = await dataSource.query(`SELECT id FROM tripdekho.vendors LIMIT 1;`);
  console.log(vendors);
  await dataSource.destroy();
}
run();
