const activity = require('./activity');
const lodash = require('lodash');

const search = '#dwdd';
const startTime = new Date('Fri Nov 13 19:00:00 +0100 2015');
const endTime = new Date('Fri Nov 13 20:00:00 +0100 2015');

console.log('Twitter activity for ', search, startTime.toDateString());

activity.getTwitterActivity(search, startTime, endTime)
  .then((twitterActivity)=> {
    const activityRanges = activity.getActivityRanges(twitterActivity);
    console.log(activityRanges);
  })
  .catch((err)=> {
    console.log(err);
    throw err;
  });