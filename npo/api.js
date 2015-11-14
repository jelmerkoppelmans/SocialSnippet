const http = require('http');
const config = require('../config.js');

const postData = JSON.stringify({
  "key": config.npo.key,
  "filters": {
    "twitter_hashtag": [],
    "twitter_account": [],
    "date": {
      "from": "2015-11-14"
    }
  },
  "size": 100
});

const options = {
  host: 'backstage-api.npo.nl',
  path: '/v0/gids/search',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-length': postData.length
  }
};

function _fetchTwitterInfo () {
  return new Promise((resolve, reject) => {
    const request = http.request(options, (response) => {
      console.log('Response status code: ' + response.statusCode);

      response.setEncoding('utf-8');
      var responseBody = '';

      response.on('data', (chunk) => {
        responseBody += chunk;
      });

      response.on('end', () => {
        if (response.statusCode === 200) {
          resolve(JSON.parse(responseBody));
        } else {
          reject(new Error('response code: ' + response.statusCode));
        }
      });
    });

    request.on('error', (error) => {
      console.log('ERROR: ' + error.message);
      reject(new Error(error.message));
    });

    request.write(postData);
    request.end();
  });
}

function getTwitterInfo () {
 return _fetchTwitterInfo();
}

module.exports = getTwitterInfo;