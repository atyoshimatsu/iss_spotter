const request = require('request');
const { ENDPOINTS } = require('./constants');

const fetchMyIP = (callback) => {
  request(ENDPOINTS.IP_ADDRESS_API_ENDPOINT, (err, res, body) => {
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
  request(ENDPOINTS.COORDS_API_ENDPOINT + ip, (err, res, body) => {
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

const fetchISSFlyOverTimes = (coords, callback) => {
  request(ENDPOINTS.ISS_PASS_API_ENDPOINT + `?lat=${coords.latitude}&lon=${coords.longitude}`, (err, res, body) => {
    if (err) {
      callback(err, null);
      return;
    }

    if (res.statusCode !== 200) {
      callback(Error(`Status Code ${res.statusCode} when fetching ISS pass. Response: ${body}`), null);
      return;
    }

    callback(null, JSON.parse(body).response);
  });
};

const nextISSTimesForMyLocation = (callback) => {
  fetchMyIP((err, ip) => {
    if (err) {
      return callback(err, null);
    }

    fetchCoordsByIP(ip, (err, loc) => {
      if (err) {
        return callback(err, null);
      }

      fetchISSFlyOverTimes(loc, (err, nextPasses) => {
        if (err) {
          return callback(err, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };
