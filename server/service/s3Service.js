const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION
});

const s3 = new AWS.S3();

class S3Service {
    uploadImage(fileName) {
        return new Promise((resolve, reject) => {
            const filePath = path.join(__dirname, '../uploads', fileName);
            const fileStream = fs.createReadStream(filePath);

            const params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: fileName,
                Body: fileStream,
                ACL: 'public-read'
            };

            s3.upload(params, (err, data) => {
                if (err) {
                    console.log('Error uploading file to S3', err);
                    reject(err);
                } else {
                    console.log('Successfully uploaded file to S3', data);
                    resolve(data.Location);
                }
            });
        });
    }

    deleteFile(fileName) {
        return new Promise((resolve, reject) => {
            const params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: fileName
            };

            s3.deleteObject(params, (err, data) => {
                if (err) {
                    console.log('Error while deleting file from S3', err);
                    reject(err);
                } else {
                    console.log('File successfully deleted from S3');
                    resolve(data);
                }
            });
        });
    }

    async getImageUrl(fileName) {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
            Expires: 3600, // URL's valid duration in seconds
        };

        return new Promise((resolve, reject) => {
            this.s3.getSignedUrl('getObject', params, (err, url) => {
                if (err) {
                    console.log('Error while retrieving image URL from S3', err);
                    reject(err);
                } else {
                    console.log('Successfully retrieved image URL from S3');
                    resolve(url);
                }
            });
        });
    }

}

module.exports = S3Service;