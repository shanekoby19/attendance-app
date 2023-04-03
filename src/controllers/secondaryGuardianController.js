const { SecondaryGuardian } = require('../models/secondaryGuardianModel');
const { PrimaryGuardian } = require('../models/primaryGuardianModel');
const AttendanceError = require('../error/AttendanceError');
const errorCatcher = require('../error/errorCatcher');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const addSecondaryGuardian = errorCatcher(async (req, res, next) => {
    // Get the primary guardian id from the request parameters
    const primaryGuardianId = req.params?.id;

    // Find the primary guardian by their id.
    const primaryGuardian = await PrimaryGuardian.findById(primaryGuardianId);

    // If the primary guardian doesn't exist return an error.
    if(!primaryGuardian) {
        return next(new AttendanceError('The primary guardian given in the request does not exist', 400, 'fail'));
    }

    // Create the secondary guardian object from the request body.
    const secondaryGuardianReq = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        profileImage: req.body.profileImage
    }

    // Create the secondary guardian in the database.
    const secondaryGuardian = await SecondaryGuardian.create(secondaryGuardianReq);

    // Add the newly created secondary guardian to the primary guardian of the request.
    primaryGuardian.secondaryGuardians.push(secondaryGuardian._id);

    await primaryGuardian.save();

    // Send a response to the client.
    res.status(201).json({
        status: 'success',
        data: {
            primaryGuardian
        }
    })
});

const updateSecondaryGuardian = errorCatcher(async (req, res, next) => {
    const secondaryGuardianId = req.params.secondaryGuardianId;

    // Create the update object use the request body.
    const secondaryGuardianUpdates = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
    }

    // Remove undefined properties
    Object.keys(secondaryGuardianUpdates).forEach(key => secondaryGuardianUpdates[key] === undefined ? delete secondaryGuardianUpdates[key] : null);

    // If a new profile image was sent delete the old one from S3.
    if(req.file) {
        // Store the profile image in the primary guardian updates object.
        secondaryGuardianUpdates.profileImage = req.body.profileImage;

        // If a new profile image was sent delete the old old.
        const secondaryGuardian = await SecondaryGuardian.findById(secondaryGuardianId);

        // Create a new S3 client with our credentials.
        const client = new S3Client({
            region: process.env.S3_REGION,
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY,
                secretAccessKey: process.env.S3_ACCESS_SECRET
            }
        });

        // Define the delete parameters.
        const params = { 
            Bucket: process.env.S3_BUCKET_NAME,
            Key: secondaryGuardian.profileImage
        };

        // Define and send the delete command.
        const deleteCommand = new DeleteObjectCommand(params);
        await client.send(deleteCommand);
    }

    // Attempt to update the secondary guardian.
    const updatedSecondaryGuardian = await SecondaryGuardian.findByIdAndUpdate(secondaryGuardianId, secondaryGuardianUpdates, {
        new: true
    });

    if(!updatedSecondaryGuardian) {
        return next(new AttendanceError('Unable to find a secondary guardian with the given id.', 400, 'fail'));
    }

    // Send the updated secondary guardian back to the client.
    res.status(200).json({
        status: 'success',
        data: {
            updatedSecondaryGuardian
        }
    });
});

const deleteSecondaryGuardian = errorCatcher(async(req, res, next) => {
    // Get the primary guardian id from the request parameters
    const primaryGuardianId = req.params?.id;

    // Find the primary guardian by their id.
    const primaryGuardian = await PrimaryGuardian.findById(primaryGuardianId);

    // If the primary guardian doesn't exist return an error.
    if(!primaryGuardian) {
        return next(new AttendanceError('The primary guardian given in the request does not exist', 400, 'fail'));
    }

    // Try to delete the secondary guardian from the database.
    const secondaryGuardianId = req.params.secondaryGuardianId;

    const secondaryGuardian = await SecondaryGuardian.findById(secondaryGuardianId);

    // Delete the secondary guardian profile image from the S3 Bucket
    // Create a new S3 client with our credentials.
    const client = new S3Client({
        region: process.env.S3_REGION,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_ACCESS_SECRET
        }
    });

    // Define the delete parameters.
    const params = { 
        Bucket: process.env.S3_BUCKET_NAME,
        Key: secondaryGuardian.profileImage
    };

    // Define and send the delete command.
    const deleteCommand = new DeleteObjectCommand(params);
    await client.send(deleteCommand);

    // Delete the secondary guardian from the database.
    await SecondaryGuardian.findByIdAndDelete(secondaryGuardianId);

    // Remove the secondary guardian from the primary guardian
    primaryGuardian.secondaryGuardians = primaryGuardian.secondaryGuardians.filter(secondaryGuardian => secondaryGuardian._id.toString() !== secondaryGuardianId);

    await primaryGuardian.save();

    // Send a no-content response to the client.
    res.status(204).json({});
});

const getSecondaryGuardians = errorCatcher(async(req, res, next) => {
    // Define the query.
    const query = {
        firstName: req.query.firstName,
        lastName: req.query.lastName,
        email: req.query.email,
        phoneNumber: req.query.phoneNumber
    }

    // Remove unused keys from the query.
    Object.keys(query).forEach(key => query[key] === undefined ? delete query[key] : null);

    // Get the secondary guardians according to the query.
    const secondaryGuardians = await SecondaryGuardian.find(query);

    // Check to see if any secondary guardians were found.
    if(secondaryGuardians.length === 0) {
        return next(new AttendanceError('We could not find any secondary guardians given you parameters.', 400, 'fail'));
    }

    // Send the secondary guardians to the client.
    res.status(200).json({
        status: 'success',
        data: {
            secondaryGuardians,
        }
    })
})

module.exports = {
    addSecondaryGuardian,
    getSecondaryGuardians,
    updateSecondaryGuardian,
    deleteSecondaryGuardian
}