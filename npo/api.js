const config = require('../config.js');
const request = require('request');
const cache = require('../activity/cache');

const postData = {
  key: config.npo.key,
  filters: {
    date: {
      from: "2015-11-12",
      to: "2015-11-13"
    }
  },
  size: 100
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
  const cacheKey = cache.getKey("npo_twitterdata", postData.filters.date.from + postData.filters.date.to);
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

        Promise.all(promises)
          .then((values) => {
            const hits = values
              .reduce((previousValue, value) => {
                return previousValue.concat(value.hits.hits);
              }, [])
              .map((value) => {
                // add twitter info when missing
                if (value._source.title.toLowerCase() === 'de wereld draait door') {
                  value._source.twitter_hashtag = '#dwdd';
                  return value;
                } else if (value._source.twitter_hashtag || value._source.twitter_account) {
                  return value;
                } else {
                  return null;
                }
              })
              .filter((value) => {
                return value !== null;
              });

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

//getTwitterInfo()
//  .then((hits) => { console.log(hits); })
//  .catch((error) => { console.log(error.message); });

module.exports = getTwitterInfo;