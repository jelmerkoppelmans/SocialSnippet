const path = require('path');
const express = require('express');

var resolver = require("./resolver/index.js");
const npo = require('./npo/api');
const activity = require('./activity');


const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/getShow', function (req, res) {
  Promise.all(
    activity.getActivity(
      req.query.hashtag,
      new Date(req.query.startTime),
      new Date(req.query.endTime)
    )
  ).then((activity)=> {
    res.send({
      title: 'De Wereld Draait Door',
      date: new Date(req.query.startTime),
      activity: activity,
      videoUrl: ''
    });
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