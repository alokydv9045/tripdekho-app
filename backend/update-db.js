const { Client } = require('pg');
const client = new Client('postgresql://postgres.waeblcermeghvtcramfa:Tripdekho%40123@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres');
client.connect().then(() => {
  const jsonOptions = JSON.stringify([
    { type: 'Double Sharing', price: 15000 },
    { type: 'Triple Sharing', price: 12000 }
  ]);
  client.query('UPDATE trip_prices SET "occupancyOptions" = $1 WHERE "tripId" = $2', [jsonOptions, 'ee840705-31bf-4d75-8893-a92b0d19b4ac']).then(res => {
    console.log('Updated', res.rowCount);
    client.end();
  }).catch(e => console.error(e));
});
