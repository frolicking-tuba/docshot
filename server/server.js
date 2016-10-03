const pending = require('./queue')('pending');
const done = require('./queue')('done');
const http = require('http');
const Job = require('./job');

const PORT = 3000;

const handleReq = (req, res) => {
  let data = '';

  req.on('data', (part) => (data += part));
  req.on('end', () => {
    res.end();
    const job = new Job('https://www.google.com', data);

    pending.push(job.serialize());
  });
};

const server = http.createServer(handleReq);

server.listen(PORT);
