import dotenv from 'dotenv';
import aws from 'aws-sdk';
import crypto from 'crypto';
import { promisify } from 'util';

dotenv.config();

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.AWS_BUCKET_NAME;

export const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4',
});

const randomBytes = promisify(crypto.randomBytes);

export const generateUploadURL = async () => {
  const rawBytes = await randomBytes(16);
  const fileName = rawBytes.toString('hex');

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Expires: 60,
  };

  const uploadURL = await s3.getSignedUrlPromise('putObject', params);

  return uploadURL;
}
