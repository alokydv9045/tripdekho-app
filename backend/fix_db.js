const { DataSource } = require("typeorm");
require('dotenv').config();

const myDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
});

myDataSource.initialize()
    .then(async () => {
        console.log("Data Source has been initialized!");
        await myDataSource.query(`ALTER TABLE vendors ADD COLUMN IF NOT EXISTS banner text`);
        console.log("Column added successfully!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
        process.exit(1);
    });
