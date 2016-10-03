const pending = require('../util/queue')('pending');
const done = require('../util/queue')('done');
const http = require('http');
const Job = require('../util/job');

done.onPop((result) => {
  const job = new Job(result);

  console.log('(server): recieved job done ', job.url);
  console.log('(server): image size: ', job.image.length);
});

function handleReq(req, res) {
  let data = '';

  req.on('data', (part) => (data += part));
  req.on('end', () => {
    res.end();
    const job = new Job('https://www.google.com', data);

    pending.push(job.serialize());
  });
}

const server = http.createServer(handleReq);

const PORT = 3000;

server.listen(PORT);
