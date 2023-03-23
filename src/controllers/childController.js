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
    }

    // Create the child using the child model and then add the child to the parent document.
    const child = await Child.create(reqChild);
    primaryGuardian.children.push(child);
    await primaryGuardian.save();

    // Send the child back in the response.
    res.status(201).json({
        status: 'success',
        data: {
            primaryGuardian
        }
    })
});

const getChild = errorCatcher(async (req, res, next) => {
    // Create the child query.
    const query = {
        firstName: req.query?.firstName,
        lastName: req.query?.lastName
    }

    // Strip the query of anything that undefined.
    Object.keys(query).forEach((key) => query[key] === undefined ? delete query[key] : null)

    // Find the child based on the query.
    const child = await Child.findOne(query);

    // If the child isn't found send an error back.
    if(!child) {
        return next(new AttendanceError(`Sorry, we couldn't find a child with that name in the database.`, 400, 'fail'));
    }

    res.status(200).json({
        status: 'success',
        data: {
            child
        }
    });
});

const getChildById = errorCatcher(async (req, res, next) => {
    // Create the child query.
    const childId = req.params?.id;

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
    const childId = req.params?.id;

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

    res.status(200).json({
        status: 'success',
        data: {
            child
        }
    });
});

const deleteChild = errorCatcher(async (req, res, next) => {
    // Get the child id from the request
    const childId = req.params?.id

    // If no child id is provided return an error.
    if(!childId) {
        return next(new AttendanceError('You must send a child id to delete a child.', 400, 'fail'));
    }

    // Delete the child and send a response.
    await Child.deleteOne({ _id: childId });

    res.status(204).json({
        status: 'success',
        data: null,
    })
})

module.exports = {
    addChild,
    getChild,
    getChildById,
    updateChild,
    deleteChild
}