const pending = require('../util/queue')('pending');
const done = require('../util/queue')('done');
const http = require('http');
const Job = require('../util/job');

let curId = 0;
const openRes = { };

done.onPop((result) => {
  const job = new Job(result);

  console.log('(server): recieved job done for', job.url);
  console.log('(server): image size: ', job.image.length);

  const res = openRes[job.id];

  delete openRes[job.id];

  console.log('(server): replying with image data... ', openRes.length);
  res.write(job.image);
  res.end();
});

const handleReq = (req, res) => {
  let data = '';

  req.on('data', (part) => (data += part));
  req.on('end', () => {
    const job = new Job(
      data,
      curId);

    openRes[curId] = res;

    curId++;

    pending.push(job.serialize());
  });
};

const server = http.createServer(handleReq);

const PORT = 3000;

server.listen(PORT);
