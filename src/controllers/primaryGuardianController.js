const { PrimaryGuardian } = require('../models/primaryGuardianModel');
const errorCatcher = require('../error/errorCatcher');
const AttendanceError = require('../error/AttendanceError');

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

    console.log(query);

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
    const updatedPrimaryGuardian = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password
    }

    // Remove any keys that are undefined before updating the primary guardian.
    Object.keys(updatedPrimaryGuardian).forEach(key => updatedPrimaryGuardian[key] === undefined ? delete updatedPrimaryGuardian[key]: null);

    // Attempt to find primaryGuardians given the id.
    const primaryGuardian = await PrimaryGuardian.findByIdAndUpdate(id, updatedPrimaryGuardian, {
        new: true,
    });

    res.status(200).json({
        status: 'success',
        data: primaryGuardian,
    })
});

const deletePrimaryGuardian = errorCatcher(async (req, res, next) => {
    // Get the id form the params
    const id = req.params.id;

    // Attempt to delete the guardian and send a response.
    await PrimaryGuardian.findByIdAndDelete(id);

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