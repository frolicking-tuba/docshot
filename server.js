const pending = require('./queue')('pending');
const done = require('./queue')('done');
const http = require('http');

const handleReq = (req, res) => {
  console.log('recieved request');
};

const server = http.createServer(handleReq);

done.onPop((result) => {
  pending.push(result.value);
  pending.push(result.value);
});

pending.push(0);
