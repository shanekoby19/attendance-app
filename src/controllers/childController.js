const { Child } = require('../models/childModel');
const errorCatcher = require('../error/errorCatcher');
const AttendanceError = require('../error/AttendanceError');
const { PrimaryGuardian } = require('../models/primaryGuardianModel');

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
        primaryGuardian: primaryGuardian._id
    }

    // Create the child using the child model and then add the child to the parent document.
    const child = await Child.create(reqChild);

    primaryGuardian.children.push(child._id);

    await primaryGuardian.save();

    // Send the child back in the response.
    res.status(201).json({
        status: 'success',
        data: {
            primaryGuardian
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
    // Create the child query.
    const childId = req.params?.childId;

    // Ensure the primary guardian exists.
    const primaryGuardian = await PrimaryGuardian.findById(req.params?.id)
    
    if(!primaryGuardian) {
        return next(new AttendanceError('The primary guardian you are trying to update does not exist.', 400, 'fail'));
    }

    // Delete any unwanted properties from req.body
    const keysToKeep = ['firstName', 'lastName', 'profileImage'];
    let childUpdates = {};
    Object.entries(req.body).forEach(([key, value]) => {
        if(keysToKeep.includes(key)) {
            childUpdates[key] = value;
        }
    })

    // Find the child based on the query.
    const child = await Child.findByIdAndUpdate(childId, childUpdates, {
        new: true,
    });
    
    if(!child) {
        return next(new AttendanceError('The child you are trying to update does not exist.', 400, 'fail'))
    }

    res.status(200).json({
        status: 'success',
        data: {
            child
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