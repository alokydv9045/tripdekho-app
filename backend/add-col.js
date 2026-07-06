const { Client } = require('pg');
const client = new Client('postgresql://postgres.waeblcermeghvtcramfa:Tripdekho%40123@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres');
client.connect().then(() => {
  client.query('ALTER TABLE tripdekho.trip_prices ADD COLUMN "occupancyOptions" text').then(res => {
    console.log('Column added');
    client.end();
  }).catch(e => console.error(e.message));
});
