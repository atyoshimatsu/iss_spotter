
const { fetchMyIP, fetchCoordsByIP } = require('./iss');

fetchMyIP((err, ip) => {
  if (err) {
    console.log("It didn't work!" , err);
    return;
  }

  console.log('It worked! Returned IP:' , ip);

  fetchCoordsByIP(ip, ((err, coords) => {
    if (err) {
      console.log("It didn't work!" , err);
      return;
    }

    console.log('It worked! Returned Coords:' , coords);
  }));
});
