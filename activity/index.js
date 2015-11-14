const twitter = require('./twitter');
const cache = require('./cache');
const lodash = require('lodash');

function getTwitterActivity (query, startTime, endTime) {
  const cacheKey = cache.getKey(query, startTime, endTime);
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return Promise.resolve(cachedData);
  }

  return twitter.getTweetActivity(query, startTime, endTime)
    .then((activity)=> {
      cache.set(cacheKey, activity);
      return activity;
    });
}

function getHotMinutes (activityPerMinute) {
  const minutes = Object.keys(activityPerMinute).length;
  const tweetsPerMinute = lodash.values(activityPerMinute);
  const totalTweets = tweetsPerMinute.reduce((total, count)=> total + count, 0);
  const averageTweetPerMinute = (totalTweets / minutes) * 1.5;

  const hotMinutes = Object.keys(activityPerMinute).reduce((hotMinutes, timeKey)=> {
    if (activityPerMinute[timeKey] >= averageTweetPerMinute) {
      hotMinutes.push(new Date(timeKey));
    }
    return hotMinutes;
  }, []);

  return hotMinutes.reverse();
}

function getActivityRanges (activityPerMinute) {
  const overlap = 2;
  const minutes = getHotMinutes(activityPerMinute);
  const ranges = [];

  minutes.forEach((time)=> {
    if (!ranges.length) {
      ranges.push([time]);
      return;
    }

    const lastRange = ranges[ranges.length - 1];
    if (time.getMinutes() - lastRange[lastRange.length - 1].getMinutes() < overlap) {
      lastRange.push(time);
    } else {
      ranges.push([time]);
    }
  });

  return ranges;
}

function getActivity (search, startTime, endTime) {
  return getTwitterActivity(search, startTime, endTime)
    .then(getActivityRanges);
}

module.exports = {
  getActivity
};