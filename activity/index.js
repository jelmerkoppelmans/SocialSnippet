const twitter = require('./twitter');
const cache = require('./cache');

function getActivity(twitterQuery, startTime, endTime) {
  const cacheKey = cache.getKey(twitterQuery, startTime, endTime);
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return Promise.resolve(cachedData);
  }

  return twitter.getTweetActivity(twitterQuery, startTime, endTime)
    .then((activity)=> {
      cache.set(cacheKey, activity);
      return activity;
    });
}

module.exports = {
  getActivity
};