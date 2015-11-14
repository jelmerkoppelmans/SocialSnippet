const path = require('path');
const express = require('express');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/getActivityRanges', function (req, res) {
  res.send({ todo: true });
});

const server = app.listen(3000, function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Server listening at http://%s:%s', host, port);
});