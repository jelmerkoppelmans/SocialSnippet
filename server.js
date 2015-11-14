const express = require('express');

const app = express();

app.get('/', function (req, res) {
  res.sendFile('./public/index.html');
});

const server = app.listen(3000, function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Server listening at http://%s:%s', host, port);
});