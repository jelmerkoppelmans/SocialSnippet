const twitter = require('./twitter');
const cache = require('./cache');
const lodash = require('lodash');

function getTwitterActivity(twitterQuery, startTime, endTime) {
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

function getHotMinutes(activityPerMinute) {
  const minutes = Object.keys(activityPerMinute).length;
  const tweetsPerMinute = lodash.values(activityPerMinute);
  const totalTweets = tweetsPerMinute.reduce((total, count)=> total + count, 0);

  const averageTweetPerMinute = (totalTweets / minutes) * 1.5;
  const maxTweetsPerMinute = Math.max.apply(Math, tweetsPerMinute);
  const hotTweetsPerMinute = averageTweetPerMinute * (1 + (averageTweetPerMinute / maxTweetsPerMinute));

  const hotMinutes = Object.keys(activityPerMinute).reduce((hotMinutes, timeKey)=> {
    if (activityPerMinute[timeKey] >= hotTweetsPerMinute) {
      hotMinutes.push(new Date(timeKey));
    }
    return hotMinutes;
  }, []);

  return hotMinutes.reverse();
}

function getActivityRanges(activityPerMinute) {
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

module.exports = {
  getTwitterActivity,
  getActivityRanges
};