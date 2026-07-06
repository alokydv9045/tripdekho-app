const axios = require('axios');
async function main() {
  try {
    const res = await axios.get('http://localhost:5001/api/v2/trips/roopkund-mystery-skeleton-lake-trek');
    const t = res.data.data;
    console.log("Trip:", t.title);
    console.log("Thumbnail:", t.thumbnail);
    console.log("RouteMapImage:", t.routeMapImage);
  } catch (e) {
    console.error(e.message);
  }
}
main();
