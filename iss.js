const request = require('request');
const { IP_ADDRESS_API_ENDPOINT, COORDS_API_ENDPOINT } = require('./constants');

const fetchMyIP = (callback) => {
  request(IP_ADDRESS_API_ENDPOINT, (err, res, body) => {
    if (err) {
      callback(err, null);
      return;
    }

    if (res.statusCode !== 200) {
      callback(Error(`Status Code ${res.statusCode} when fetching IP. Response: ${body}`), null);
      return;
    }

    callback(null, JSON.parse(body).ip);
  });
};

const fetchCoordsByIP = (ip, callback) => {
  request(COORDS_API_ENDPOINT + ip, (err, res, body) => {
    if (err) {
      callback(err, null);
      return;
    }

    if (res.statusCode !== 200) {
      callback(Error(`Status Code ${res.statusCode} when fetching coords. Response: ${body}`), null);
      return;
    }

    const coords = JSON.parse(body);
    if (!coords.success) {
      const message = `Success status was ${coords.success}. Server message says: ${coords.message} when fetching for IP ${coords.ip}`;
      callback(Error(message), null);
      return;
    }
    const { latitude, longitude } = coords;
    callback(null, { latitude, longitude });
  });
};


module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
};
