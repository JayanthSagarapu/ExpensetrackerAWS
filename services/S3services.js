const AWS = require("aws-sdk");

const uploadToS3 = (data, filname) => {
  const BUCKET_NAME = "expensetrackingapp2";
  const IAM_USER_KEY = "AKIA3DS6THHWJMHAJNUC";
  const IAM_USER_SECRET = "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";

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  });

  var params = {
    Bucket: BUCKET_NAME,
    Key: filname,
    Body: data,
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    // S3 ManagedUpload with callbacks are not supported in AWS SDK for JavaScript (v3).
    // Please convert to `await client.upload(params, options).promise()`, and re-run aws-sdk-js-codemod.
    // S3 ManagedUpload with callbacks are not supported in AWS SDK for JavaScript (v3).
    // Please convert to `await client.upload(params, options).promise()`, and re-run aws-sdk-js-codemod.
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(s3response.Location);
      }
    });
  });
};

module.exports = {
  uploadToS3,
};
