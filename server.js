const path = require('path');
const express = require('express');

var resolver = require("./resolver/index.js");
const npo = require('./npo/api');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/getVideoURL/:id', function (req, res){
	resolver.getVideoURL(req.params.id, res.send.bind(res));
});

app.get('/getActivityRanges', function (req, res) {
  res.send({ todo: true });
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