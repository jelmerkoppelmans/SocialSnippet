const activity = require('./activity');


activity.getActivity('#dwdd',
  new Date('Fri Nov 13 19:00:00 +0100 2015'),
  new Date('Fri Nov 13 20:00:00 +0100 2015')
)
  .then(console.log.bind(console))
  .catch(console.log.bind(console));