const { PrimaryGuardian } = require('../models/primaryGuardianModel');
const { Child } = require('../models/childModel');
const { SecondaryGuardian } = require('../models/secondaryGuardianModel');
const errorCatcher = require('../error/errorCatcher');
const AttendanceError = require('../error/AttendanceError');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3'); // ES Modules import

const addPrimaryGuardian = errorCatcher(async (req, res, next) => {
    // Create the primary guardian object to add to the database.
    const reqPrimaryGuardian = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
        profileImage: req.body.profileImage
    }

    // Create the primary guardian in the database and send it back to the user.
    const primaryGuardian = await PrimaryGuardian.create(reqPrimaryGuardian);

    res.status(201).json({
        status: 'success',
        data: primaryGuardian
    })
});

const getPrimaryGuardians = errorCatcher(async (req, res, next) => {
    // define the query based on the query parameters.
    const query = {
        firstName: req.query.firstName,
        lastName: req.query.lastName,
        email: req.query.email,
        phoneNumber: req.query.phoneNumber
    }

    // Remove undefined query options from the query.
    Object.keys(query).forEach(key => query[key] === undefined ? delete query[key] : null);

    // Attempt to find primaryGuardians given the query.
    const primaryGuardians = await PrimaryGuardian.find(query);

    if(primaryGuardians.length === 0) {
        return next(new AttendanceError('Sorry, we were unable to find any users with the given query.', 400, 'fail'))
    }

    res.status(200).json({
        status: 'success',
        data: primaryGuardians
    })

});

const getPrimaryGuardianById = errorCatcher(async (req, res, next) => {
    // Get the primary guardian id from the request parameter id.
    const id = req.params?.id;

    // Attempt to find primaryGuardians given the id.
    const primaryGuardian = await PrimaryGuardian.findById(id);
    
    if(!primaryGuardian) {
        return next(new AttendanceError('Sorry, we were unable to find a primary guardian with the given id.', 400, 'fail'))
    }

    res.status(200).json({
        status: 'success',
        data: primaryGuardian
    })

});

const updatePrimaryGuardian = errorCatcher(async (req, res, next) => {
    // Get the primary guardian id from the request parameter id.
    const id = req.params?.id;

    // Define the update primary guardian.
    const primaryGuardianUpdates = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password
    }

    // Remove any keys that are undefined before updating the primary guardian.
    Object.keys(primaryGuardianUpdates).forEach(key => primaryGuardianUpdates[key] === undefined ? delete primaryGuardianUpdates[key]: null);

    if(req.file) {
        // Store the profile image in the primary guardian updates object.
        primaryGuardianUpdates.profileImage = req.body.profileImage;

        // If a new profile image was sent delete the old old.
        const primaryGuardian = await PrimaryGuardian.findById(id);

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
            Key: primaryGuardian.profileImage
        };

        // Define and send the delete command.
        const deleteCommand = new DeleteObjectCommand(params);
        await client.send(deleteCommand);
    }

    // Attempt to find primaryGuardians given the id.
    const updatedPrimaryGuardian = await PrimaryGuardian.findByIdAndUpdate(id, primaryGuardianUpdates, {
        new: true,
    });

    if(!updatePrimaryGuardian) {
        return next(new AttendanceError('Unable to find a primary guardian with the given id.', 400, 'fail'));
    }

    res.status(200).json({
        status: 'success',
        data: updatedPrimaryGuardian,
    })
});

const deletePrimaryGuardian = errorCatcher(async (req, res, next) => {
    // Get the id form the params
    const id = req.params.id;

    // Find the primary guardian in the database.
    const primaryGuardian = await PrimaryGuardian.findById(id);

    if(!primaryGuardian) {
        return next(new AttendanceError('The primary guardian you are trying to delete does not exist in the database.', 400, 'fail'));
    }

    // Remove all child images from the Amazon S3
    const deletedChildImagePromises = primaryGuardian.children.map(async child => {
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
            Key: child.profileImage
        };

        // Define and send the delete command.
        const deleteCommand = new DeleteObjectCommand(params);
        return await client.send(deleteCommand);
    });

    Promise.all(deletedChildImagePromises);

    // Create a promise for each deleted child.
    const deletedChildPromises = primaryGuardian.children.map(async (child) => await Child.findByIdAndDelete(child._id));

    // Delete all children.
    Promise.all(deletedChildPromises);

    // Remove all secondary guardian images from the Amazon S3
    const deletedSecondaryGuardianImages = primaryGuardian.secondaryGuardians.map(async secondaryGuardian => {
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
        return await client.send(deleteCommand);
    });

    // Delete all the secondary guardian images from the Amazon S3 bucket.
    Promise.all(deletedSecondaryGuardianImages);

    // Create a promise for each deleted secondary guardian
    const deletedSecondaryGuardianPromises = primaryGuardian.secondaryGuardians.map(async (secondaryGuardian) => await SecondaryGuardian.findByIdAndDelete(secondaryGuardian._id))

    // Delete all secondary Guardians.
    Promise.all(deletedSecondaryGuardianPromises);

    // Attempt to delete the guardian and send a response.
    await PrimaryGuardian.findByIdAndDelete(id);

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
        Key: primaryGuardian.profileImage
    };

    // Define and send the delete command.
    const deleteCommand = new DeleteObjectCommand(params);
    await client.send(deleteCommand);

    res.status(204).json({
        status: 'success',
        data: null,
    })
});

module.exports = {
    addPrimaryGuardian,
    getPrimaryGuardians,
    getPrimaryGuardianById,
    updatePrimaryGuardian,
    deletePrimaryGuardian
}