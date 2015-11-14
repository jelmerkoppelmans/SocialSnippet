const config = require('../config.js');
const request = require('request');
const cache = require('../activity/cache');

const postData = {
  "key": config.npo.key,
  "filters": {
    "twitter_hashtag": [],
    "twitter_account": [],
    "date": {
      "from": "2015-11-14"
    }
  },
  "size": 100
};

const options = {
  uri: 'http://backstage-api.npo.nl/v0/gids/search',
  method: 'POST',
  json: true
};

function _fetchTwitterInfoPage (from) {
  var requestOptions = JSON.parse(JSON.stringify(options));
  requestOptions.body = postData;
  requestOptions.body.from = from;

  return new Promise((resolve, reject) => {
    request(requestOptions, (err, response, body) => {
      if (err) {
        console.log(err.message);
      }

      console.log('Response status code: ' + response.statusCode);
      if (response.statusCode === 200) {
        resolve(body);
      } else {
        reject(new Error('response code: ' + response.statusCode));
      }
    });
  });
}

function _fetchTwitterInfo () {
  const cacheKey = cache.getKey("npo_twitterdata", "2015-11-14");
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return Promise.resolve(cachedData);
  }

  console.log('fetch');
  var requestOptions = JSON.parse(JSON.stringify(options));
  requestOptions.body = postData;

  return new Promise((resolve, reject) => {
    request(requestOptions, (err, response, body) => {
      if (err) {
        console.log(err.message);
      }

      console.log('Response status code: ' + response.statusCode);
      if (response.statusCode === 200) {
        const pages = Math.ceil(body.hits.total / 100);
        const promises = [];

        for (var i = 0; i < pages; i++) {
          promises.push(_fetchTwitterInfoPage(i * 100));
        }

        Promise.all(promises).then((values) => {
          const hits = values.map((value) => { return value.hits.hits });

          cache.set(cacheKey, hits);

          resolve(hits);
        });

      } else {
        reject(new Error('response code: ' + response.statusCode));
      }
    });
  });
}

function getTwitterInfo () {
 return _fetchTwitterInfo();
}

getTwitterInfo()
  .then((hits) => { console.log(hits); })
  .catch((error) => { console.log(error.message); });

module.exports = getTwitterInfo;