const pending = require('../util/queue')('pending');
const done = require('../util/queue')('done');
const Job = require('../util/job');

pending.onPop((result) => {
  const job = new Job(result);

  done.push(job.serialize());
});
