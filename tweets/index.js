const Twitter = require('twitter');
const jsonfile = require('jsonfile');
const lodash = require('lodash');
const keys = require('../config.js');

const client = new Twitter(keys.twitter);

function fetchTweets (query) {
  const params = {
    q: query,
    result_type: 'recent',
    count: 100
  };
  return new Promise((resolve, reject)=> {
    client.get('search/tweets.json', params, (err, tweets)=> {
      if (err) {
        reject(new Error(err));
        return;
      }
      resolve(tweets.statuses);
    });
  });
}

function filterTweetsByDate (start, end) {
  return (tweets)=> {
    return tweets.filter((tweet)=> {
      const tweetDate = new Date(tweet.created_at);
      return tweetDate >= start && tweetDate <= end;
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
    return tweets.length;
  });
}

/**
 * @param {String} query
 * @param {Date} startTime
 * @param {Date} endTime
 * @returns {Promise} contains { 'dateStr': 123 }, per minute
 */
function getTweetActivity(query, startTime, endTime) {
  return fetchTweets(query)
    .then(filterTweetsByDate(startTime, endTime))
    .then(groupTweetsByTime)
    .then(countActivity);
}

module.exports = getTweetActivity;

