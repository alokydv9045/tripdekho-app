const { Client } = require('pg');
const client = new Client('postgresql://postgres.waeblcermeghvtcramfa:Tripdekho%40123@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres');
client.connect().then(() => {
  client.query('SELECT "occupancyOptions" FROM tripdekho.trip_prices').then(res => {
    console.log(res.rows);
    client.end();
  }).catch(e => console.error(e));
});
