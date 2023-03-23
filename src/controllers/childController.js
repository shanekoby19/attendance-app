const { Child } = require('../models/childModel');
const errorCatcher = require('../error/errorCatcher');
const AttendanceError = require('../error/AttendanceError');

const addChild = errorCatcher(async (req, res, next) => {
    // Get child info from the request.
    const reqChild = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        profileImage: req.body.profileImage,
    }

    // Create the child use the child model.
    const child = await Child.create(reqChild);

    // Send the child back in the response.
    res.status(201).json({
        status: 'success',
        data: {
            child
        }
    })
});

const getChild = errorCatcher(async (req, res, next) => {
    // Create the child query.
    const query = {
        firstName: req.query?.firstName,
        lastName: req.query?.lastName
    }

    // Find the child based on the query.
    const child = await Child.find(query);

    // If the child isn't found send an error back.
    if(!child) {
        next(new AttendanceError(`Sorry, we couldn't find a child with that name in the database.`));
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
        next(new AttendanceError(`Sorry, we couldn't find a child with that id in the database.`));
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

    // Delete any upwanted properties from req.body
    const keysToKeep = ['firstName', 'lastName', 'profileImage'];
    let childUpdates = {};
    Object.entries(req.body).forEach(([key, value]) => {
        if(keysToKeep.includes(key)) {
            childUpdates[key] = value;
        }
    })

    // Find the child based on the query.
    const child = await Child.findByIdAndUpdate(childId, childUpdates);

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
        return next(new AttendanceError('You must send a child id to delete a child.'));
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