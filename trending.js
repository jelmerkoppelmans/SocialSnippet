const activity = require('./activity');
const npo = require('./npo/api.js');

npo()
  .then((hits) => {
    const hashtag = hits[0]._source.twitter_hashtag;
    const startTime = new Date(hits[0]._source.published_start_time);
    const duration = hits[0]._source.published_duration;

    const durationHours = parseInt(duration.substr(2,2));
    const durationMinutes = parseInt(duration.substr(5,2));
    const durationSeconds = parseInt(duration.substr(8,2));

    const endTime = new Date(hits[0]._source.published_start_time);
    endTime.setHours(endTime.getHours() + durationHours);
    endTime.setMinutes(endTime.getMinutes() + durationMinutes);
    endTime.setSeconds(endTime.getSeconds() + durationSeconds);

    console.log('HASHTAG: ' + hashtag);
    console.log(startTime);
    console.log(duration);
    console.log(endTime);

    activity.getActivity(hashtag, startTime, endTime)
      .then((result) => {
        console.log('RESULT!!!');
        console.log(result);
      });
  })
  .catch(error => console.log(error.message));