const Twitter = require('twitter');
const lodash = require('lodash');
const keys = require('../config.js');

const client = new Twitter(keys.twitter);

function fetchTweets (params) {
  return new Promise((resolve, reject)=> {
    console.log('fetching tweets...', JSON.stringify(params));
    client.get('search/tweets.json', params, (err, tweets)=> {
      if (err) {
        reject(new Error(err));
        return;
      }
      resolve(tweets.statuses);
    });
  });
}

function fetchTweetsUntil(params, startTime, offsetId) {
  if (offsetId) {
    params.max_id = offsetId;
  }
  return fetchTweets(params).then((tweets)=> {
    const lastTweet = tweets[tweets.length - 1];
    if (lastTweet && new Date(lastTweet.created_at) > startTime) {
      return fetchTweetsUntil(params, startTime, lastTweet.id)
        .then((nextTweets)=> {
          return tweets.concat(nextTweets);
        });
    }
    return tweets;
  });
}

function fetchTweetsWithinTime (query, startTime, endTime) {
  const until = new Date(endTime);
  until.setDate(until.getDate() + 1);

  const params = {
    q: query,
    result_type: 'recent',
    count: 100,
    until: until.toISOString().substr(0, 10)
  };
  return fetchTweetsUntil(params, startTime);
}

function filterTweetsByDate (startTime, endTime) {
  return (tweets)=> {
    return tweets.filter((tweet)=> {
      const tweetTime = new Date(tweet.created_at);
      return tweetTime >= startTime && tweetTime <= endTime;
    });
  };
}

function groupTweetsByTime (tweets) {
  return lodash.groupBy(tweets, (tweet)=> {
    const tweetDate = new Date(tweet.created_at);
    tweetDate.setSeconds(0);
    return tweetDate;
  });
}

function countActivity (dateGroups) {
  return lodash.mapValues(dateGroups, (tweets)=> {
    console.log('Total tweets', tweets.length);
    return tweets.length;
  });
}

/**
 * @param {String} query
 * @param {Date} startTime
 * @param {Date} endTime
 * @returns {Promise} contains { 'dateStr': 123 }, per minute
 */
function getTweetActivity (query, startTime, endTime) {
  return fetchTweetsWithinTime(query, startTime, endTime)
    .then(filterTweetsByDate(startTime, endTime))
    .then(groupTweetsByTime)
    .then(countActivity);
}

module.exports = {
  getTweetActivity
};