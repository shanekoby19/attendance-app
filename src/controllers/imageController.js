require('dotenv').config();
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require('fs');

const errorCatcher = require('../error/errorCatcher');
const AttendanceError = require('../error/AttendanceError');

const client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_ACCESS_SECRET
    }
})

const uploadImage = errorCatcher(async (req, res, next) => {
    // Get the file from the request.
    const { file } = req;

    // Determine the s3 bucket folder by the request.
    const imageFolder = req.originalUrl.split('/').slice(-1)[0];

    // If no file was given send back an error.
    if(!file) {
       return next(new AttendanceError('We tried to upload a file but no file was found.', 400, 'fail'));
    }

    // Store the extension and the filename.
    const extension = file.mimetype.split('/')[1];
    const filename = `${file.originalname.split('.')[0]}-${Date.now()}.${extension}`

    // Define the upload parameters
    const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Body: file.buffer,
        Key: `images/${imageFolder}/${filename}`
    }

    // Create the upload command
    const command = new PutObjectCommand(uploadParams);

    // Try to upload the file to s3.
    await client.send(command);

    // Add the profileImage property to the filepath.
    req.body.profileImage = `images/${imageFolder}/${filename}`;

    next();
});

module.exports = uploadImage;
