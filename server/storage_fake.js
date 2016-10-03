module.exports.send = (job) =>
  new Promise((resolve) => {
    resolve(job.image);
  });
