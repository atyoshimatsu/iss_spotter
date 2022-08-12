const request = require('request');
const { IP_ADDRESS_API_ENDPOINT } = require('./constants');

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

module.exports = { fetchMyIP };
