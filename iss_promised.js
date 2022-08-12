const request = require('request-promise-native');
const { ENDPOINTS} = require('./constants');

const fetchMyIP = () => {
  return request(ENDPOINTS.IP_ADDRESS_API_ENDPOINT);
};

const fetchCoordsByIP = (body) => {
  const { ip } = JSON.parse(body);
  return request(ENDPOINTS.COORDS_API_ENDPOINT + ip);
};

const fetchISSFlyOverTimes = (body) => {
  const { latitude, longitude } = JSON.parse(body);
  return request(ENDPOINTS.ISS_PASS_API_ENDPOINT + `?lat=${latitude}&lon=${longitude}`);
};

const nextISSTimesForMyLocation = () => {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
};

module.exports = {
  nextISSTimesForMyLocation,
};
