const pending = require('../util/queue')('pending');
const done = require('../util/queue')('done');
const http = require('http');
const Job = require('../util/job');
const storage = require('./storage_s3');

let curId = 0;
const openRes = { };

done.onPop((result) => {
  const job = new Job(result);

  console.log('(server): recieved job done for', job.url);
  console.log('(server): image size: ', job.image.length);

  const res = openRes[job.id];

  Reflect.deleteProperty(openRes, job.id);

  console.log('(server): storing data');

  storage.send(job)
    .then((accessor) => {
      console.log('(server): image stored! sending back accessor');
      res.write(accessor);
      res.end();
    });
});

const handlePost = (req, res) => {
  res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
  let data = '';

  req.on('data', (part) => (data += part));
  req.on('end', () => {
    const job = new Job(data, curId);

    openRes[curId] = res;

    curId++;

    pending.push(job.serialize());
  });
};

const handleOptions = (req, res) => {
  res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
  res.end();
};

const handleReq = (req, res) => {
  if (req.method === 'OPTIONS') {
    handleOptions(req, res);
  } else if (req.method === 'POST') {
    handlePost(req, res);
  }
};

const server = http.createServer(handleReq);

const PORT = 3000;

server.listen(PORT);
