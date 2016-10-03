const aws = require('aws-sdk');

const s3 = new aws.S3({ params: { Bucket: process.env.AWS_BUCKET }});

const createFilename = (job) =>
  `docshot/${job.url
  .replace(/\w+:\/\//g, '')
  .replace(/[^\w\/]/g, '')
  .replace(/\/\//g, '/')}${(new Date()).getTime()}.png`;

module.exports.send = (job) =>
  new Promise((resolve) => {
    s3.upload({
      Key: createFilename(job),
      Body: Buffer.from(job.image, 'base64'),
      ContentType: 'image/png',
      ACL: 'public-read'
    }, (err, res) => {
      if (err) {
        console.log('err', err);
      } else {
        console.log('successn', res);
        resolve(res.Location);
      }
    });
  });
