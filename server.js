const path = require('path');
const express = require('express');
const npo = require('./npo/api');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/getShow', function (req, res) {
  res.send({
    title: 'De Wereld Draait Door',
    date: new Date(),
    activity: [[new Date(), new Date()]],
    videoUrl: ''
  });
});

app.get('/getShows', function (req, res) {
  npo()
    .then((hits) => {
      res.send(hits);
    });
});

const server = app.listen(3000, function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Server listening at http://%s:%s', host, port);
});