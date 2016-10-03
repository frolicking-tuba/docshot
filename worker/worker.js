phantom.page.onError = function(msg, trace){
  console.log(msg);
  trace.forEach(function(item){
    console.log(item);
  });
};

//const pending = require('./queue')('pending');
//const done = require('./queue')('done');
//const Job = require('./job');

console.log('here');

//pending.onPop((result) => {
  //const job = new Job(result);

  //console.log(job.url);
  //console.log(job.html.length);
//});
