const pending = require('./queue')('pending');
const done = require('./queue')('done');

pending.onPop((result) => {
  done.push({
    pid: process.pid,
    value: result + (process.pid % 2 === 0 ? 1 : -1)
  });
});
