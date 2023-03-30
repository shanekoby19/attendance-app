const { SecondaryGuardian } = require('../models/secondaryGuardianModel');
const { PrimaryGuardian } = require('../models/primaryGuardianModel');
const AttendanceError = require('../error/AttendanceError');
const errorCatcher = require('../error/errorCatcher');

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

    // Send a response to the client.
    res.status(201).json({
        status: 'success',
        data: {
            primaryGuardian
        }
    })
})

module.exports = {
    addSecondaryGuardian,
}