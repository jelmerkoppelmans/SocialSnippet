const path = require('path');
const express = require('express');
const video = require('./resolver/index.js');
const npo = require('./npo/api');
const activity = require('./activity');


function getVideoURL(prid) {
  return new Promise((resolve)=> {
    video.getVideoURL(prid, resolve);
  });
}

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/getShow', function (req, res) {
  Promise.all([
    activity.getActivity(
      req.query.hashtag,
      new Date(req.query.startTime),
      new Date(req.query.endTime)
    ),
    getVideoURL(req.query.prid)
  ]).then((answers)=> {
    const activity = answers[0];
    const videoUrl = answers[1];
    const date = new Date(req.query.startTime);

    res.send({
      title: 'De Wereld Draait Door',
      date: new Date(req.query.startTime),
      activity: activity,
      videoUrl: videoUrl.url
    });
  })
  .catch((err)=> {
    console.log(err)
  });
});

app.get('/getShows', (req, res)=> {
  npo().then(res.send.bind(res));
});

const server = app.listen(3000, ()=> {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Server listening at http://%s:%s', host, port);
});