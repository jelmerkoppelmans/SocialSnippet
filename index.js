const activity = require('./activity');

const search = '#dwdd';
const startTime = new Date('Fri Nov 13 19:00:00 +0100 2015');
const endTime = new Date('Fri Nov 13 20:00:00 +0100 2015');

//
//const search = '#feyaja';
//const startTime = new Date('Sun Nov 8 14:30:00 +0100 2015');
//const endTime = new Date('Sun Nov 8 16:30:00 +0100 2015');

console.log('Twitter activity for ', search, startTime.toDateString());

activity.getActivity(search, startTime, endTime)
  .then((activityRanges)=> {
    console.log(activityRanges);
  })
  .catch((err)=> {
    console.log(err);
    throw err;
  });