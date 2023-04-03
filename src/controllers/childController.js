const { Child } = require('../models/childModel');
const errorCatcher = require('../error/errorCatcher');
const AttendanceError = require('../error/AttendanceError');
const { PrimaryGuardian } = require('../models/primaryGuardianModel');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const addChild = errorCatcher(async (req, res, next) => {
    const primaryGuardianId = req.params.id;

    // Find the primary guardian given the primary guardian id.
    const primaryGuardian = await PrimaryGuardian.findById(primaryGuardianId);

    if(!primaryGuardian) {
        return next(new AttendanceError('Sorry, you must provide a valid parent to add this child to.', 400, 'fail'))
    }

    // Get child info from the request.
    const reqChild = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        profileImage: req.body.profileImage,
    }

    // Create the child using the child model and then add the child to the parent document.
    const child = await Child.create(reqChild);

    primaryGuardian.children.push(child._id);

    await primaryGuardian.save();

    // Send the child back in the response.
    res.status(201).json({
        status: 'success',
        data: {
            child
        }
    })
});

const getChildren = errorCatcher(async (req, res, next) => {
    // Create the child query.
    const query = {
        firstName: req.query?.firstName,
        lastName: req.query?.lastName
    }

    // Strip the query of anything that undefined.
    Object.keys(query).forEach((key) => query[key] === undefined ? delete query[key] : null)

    // Find the child based on the query.
    const children = await Child.find(query);

    // If the child isn't found send an error back.
    if(children.length === 0) {
        return next(new AttendanceError(`Sorry, we couldn't find a child with that name in the database.`, 400, 'fail'));
    }

    res.status(200).json({
        status: 'success',
        data: {
            children
        }
    });
});

const getChildById = errorCatcher(async (req, res, next) => {
    // Create the child query.
    const childId = req.params?.childId;

    // Find the child based on the query.
    const child = await Child.findById(childId);

    // If the child isn't found send an error back.
    if(!child) {
        return next(new AttendanceError(`Sorry, we couldn't find a child with that id in the database.`, 400, 'fail'));
    }

    res.status(200).json({
        status: 'success',
        data: {
            child
        }
    });
})

const updateChild = errorCatcher(async (req, res, next) => {
    // Get the primary guardian id from the request parameters.
    const primaryGuardianId = req.params.id;

    // Ensure the primary guardian exists.
    const primaryGuardian = await PrimaryGuardian.findById(primaryGuardianId)
    
    if(!primaryGuardian) {
        return next(new AttendanceError('The primary guardian you are trying to update does not exist.', 400, 'fail'));
    }

    let childUpdates = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    };

    Object.entries(childUpdates).forEach(key => childUpdates[key] === undefined ? delete childUpdates[key] : undefined);

    const childId = req.params.childId;

    // If a new profile image was sent delete the old one from S3.
    if(req.file) {
        // Store the profile image in the primary guardian updates object.
        childUpdates.profileImage = req.body.profileImage;

        // If a new profile image was sent delete the old old.
        const child = await Child.findById(childId);

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
        await client.send(deleteCommand);
    }

    // Find the child based on the query.
    const updatedChild = await Child.findByIdAndUpdate(childId, childUpdates, {
        new: true,
    });
    
    if(!updatedChild) {
        return next(new AttendanceError('The child you are trying to update does not exist.', 400, 'fail'))
    }

    res.status(200).json({
        status: 'success',
        data: {
            updatedChild
        }
    });
});

const deleteChild = errorCatcher(async (req, res, next) => {
    // Get the parent based on the url id parameter.
    const primaryGuardianId = req.params?.id

    // Ensure a valid primary guardian id was sent in the request.
    const primaryGuardian = await PrimaryGuardian.findById(primaryGuardianId);

    if(!primaryGuardian) {
        return next(new AttendanceError('The primary guardian you are trying to update does not exist.', 400, 'fail'))
    }

    // Get the child id from the request and ensure it's valid.
    const childId = req.params?.childId

    const child = await Child.findById(childId);;

    // If no child id is provided return an error.
    if(!child) {
        return next(new AttendanceError('The child you are trying to delete does not exist in the database.', 400, 'fail'));
    }

    // Delete the child and send a response.
    await Child.findByIdAndDelete(childId);

    // Delete the child profile image from the S3 Bucket
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
    await client.send(deleteCommand);

    // Remove the child from the primary guardian
    primaryGuardian.children = primaryGuardian.children.filter(child => child._id.toString() !== childId);

    await primaryGuardian.save();

    res.status(204).json({
        status: 'success',
        data: null,
    })
})

module.exports = {
    addChild,
    getChildren,
    getChildById,
    updateChild,
    deleteChild
}