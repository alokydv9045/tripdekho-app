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
  console.log("Connected to DB");
  try {
    await dataSource.query(`ALTER TABLE tripdekho.vendors ADD COLUMN "deletedAt" TIMESTAMP;`);
    console.log("Added deletedAt column");
  } catch(e) {
    console.log("Failed:", e.message);
  }
  await dataSource.destroy();
}
run();
