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
        phantomPage = page;

        console.log(
          '(worker): adjusting viewport size to',
          this.job.browserWidth,
          this.job.browserHeight);

        return phantomPage.property('viewportSize', {
          width: this.job.browserWidth,
          height: this.job.browserHeight
        });
      })
      .then((status) => {
        console.log('(worker): opened page', status);
        console.log(
          '(worker): adjusting viewport clipping to',
          this.job.clipX,
          this.job.clipY,
          this.job.clipWidth,
          this.job.clipHeight);

        return phantomPage.property('clipRect', {
          left: this.job.clipX,
          top: this.job.clipY,
          width: this.job.clipWidth,
          height: this.job.clipHeight
        });
      })
      .then(() =>
        phantomPage.setting('userAgent', this.job.userAgent))
      .then(() => {
        console.log('(worker): phantom opening url');

        return phantomPage.open(`http://localhost:${this.serverPort}`);
        //return phantomPage.open(this.job.url);
      })
      .then(() => {
        console.log('(worker): rendering to baset64 PNG');

        return phantomPage.renderBase64('PNG');
      })
      .then((imageData) => {
        console.log('(worker): done rendering');

        this.job.setImage(imageData);

        console.log('(worker): shutting down phantom');
        this.phantom.exit();
        this.onDone();
      })
      .catch((err) => {
        console.log('(worker): error with phantom', err);
      });
  }

  httpReq(req, res) {
    console.log('(worker): recieved http request', req.method, 'to', req.url);
    res.write(this.job.html);
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
