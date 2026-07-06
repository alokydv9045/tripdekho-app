const axios = require('axios');
async function main() {
  try {
    const res = await axios.get('http://localhost:5001/api/v2/trips?limit=10');
    const trips = res.data.data.trips;
    trips.forEach(t => {
      console.log("Trip:", t.title);
      console.log("Thumbnail:", t.thumbnail);
      console.log("RouteMapImage:", t.routeMapImage);
      console.log("---");
    });
  } catch (e) {
    console.error(e.message);
  }
}
main();
