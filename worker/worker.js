const pending = require('../util/queue')('pending');
const done = require('../util/queue')('done');
const Job = require('../util/job');
const http = require('http');
const phantom = require('phantom');

class JobRunner {
  constructor(job) {
    this.job = job;
  }

  start(onDone) {
    this.onDone = onDone;

    console.log('(worker): recieved job, starting server');
    this.startHttpServer();

    this.server.on('listening', () => {
      this.serverPort = this.server.address().port;
      console.log('(worker): server is up, listening on port', this.serverPort);

      this.launchPhantom();
    });
  }

  launchPhantom() {
    console.log('(worker): launching phantomjs');

    phantom.create()
      .then((phantomInstance) => {
        console.log('(worker): phantom is ready to go!');
        this.phantom = phantomInstance;
        this.loadPage();
      })
      .catch((err) => {
        console.log('(worker): error launching phantom', err);
      });
  }

  loadPage() {
    console.log('(worker): phantom creating page');

    let phantomPage = null;

    this.phantom.createPage()
      .then((page) => {
        console.log('(worker): phantom opening url');

        phantomPage = page;

        return page.open(`http://localhost:${this.serverPort}`);
      })
      .then((status) => {
        console.log('(worker): opened page', status);
        phantomPage.render('test.png');

        this.phantom.exit();
        this.onDone();
      })
      .catch((err) => {
        console.log('(worker): error with phantom', err);
      });
  }

  httpReq(req, res) {
    console.log('(worker): recieved http request');
    console.log(req.method);
    res.end();
  }

  startHttpServer() {
    this.server = http.createServer(this.httpReq.bind(this));
    this.server.listen(0);
  }
}

pending.onPop((result) => {
  const job = new Job(result);
  const runner = new JobRunner(job);

  runner.start(() => {
    console.log('(worker): job complete!');
    done.push(job.serialize());
  });
});
