const { Attendance } = require('../models/attendanceModel');
const { PrimaryGuardian } = require('../models/primaryGuardianModel');
const { SecondaryGuardian } = require('../models/secondaryGuardianModel');
const { User } = require('../models/userModel');
const { Child } = require('../models/childModel');

const errorCatcher = require('../error/errorCatcher');
const AttendanceError = require('../error/AttendanceError');

const checkIn = errorCatcher(async (req, res, next) => {
    const attendanceRecord = {
        timeIn: req.body.timeIn,
        dropOffPrimaryGuardian: req.body.dropOffPrimaryGuardian,
        dropOffSecondaryGuardian: req.body.dropOffSecondaryGuardian,
        checkedInBy: req.body.checkedInBy,
        child: req.body.child,
    }

    // Ensure a primary guardian or secondary guardian was given in the request.
    if(!attendanceRecord.dropOffPrimaryGuardian && !attendanceRecord.dropOffSecondaryGuardian) {
        return next(new AttendanceError('A primary guardian or secondary guardian is required for checkin.', 400, 'fail'));
    }

    let guardian = {};

    // Ensure the guardian exists and assign them..
    if(attendanceRecord.dropOffPrimaryGuardian) {
        guardian = await PrimaryGuardian.findById(attendanceRecord.dropOffPrimaryGuardian);
        if(!guardian) {
            return next(new AttendanceError('Invalid primary guardian.', 400, 'fail'))
        }
    } else {
        guardian = await SecondaryGuardian.findById(attendanceRecord.dropOffSecondaryGuardian._id);
        if(!guardian) {
            return next(new AttendanceError('Invalid secondary guardian.', 400, 'fail'))
        }
    }

    // Ensure the checkin user exists in the database.
    const checkInUser = await User.findById(attendanceRecord.checkedInBy);
    if(!checkInUser) {
        return next(new AttendanceError('Inavlid check-in user.', 400, 'fail'))
    }

    // Ensure the child exists in the database.
    const child = await Child.findById(attendanceRecord.child);
    if(!child) {
        return next(new AttendanceError('Inavlid child.', 400, 'fail'))
    }

    // Add the attendance record to the database.
    const record = await Attendance.create(attendanceRecord);

    res.status(201).json({
        status: 'success',
        data: {
            record
        }
    })
});

const checkOut = errorCatcher(async(req, res, next) => {
    const recordId = req.params?.id;

    // Ensure that the attendance record exists.
    const attendanceRecord = await Attendance.findById(recordId);

    if(!attendanceRecord) {
        return next(new AttendanceError('The attendance record you are trying to update does not exist.', 400, 'fail'))
    }

    const updatedRecord = {
        timeOut: req.body.timeOut,
        pickUpPrimaryGuardian: req.body.pickUpPrimaryGuardian,
        pickUpSecondaryGuardian: req.body.pickUpSecondaryGuardian,
        checkedOutBy: req.body.checkedOutBy,
    }

    // Ensure a primary guardian or secondary guardian was given in the request.
    if(!updatedRecord.pickUpPrimaryGuardian && !updatedRecord.pickUpSecondaryGuardian) {
        return next(new AttendanceError('A primary guardian or secondary guardian is required for checkin.', 400, 'fail'));
    }

    let guardian = {};

    // Ensure the guardian exists and assign them..
    if(updatedRecord.pickUpPrimaryGuardian) {
        guardian = await PrimaryGuardian.findById(updatedRecord.pickUpPrimaryGuardian);
        if(!guardian) {
            return next(new AttendanceError('Invalid primary guardian.', 400, 'fail'))
        }
    } else {
        guardian = await SecondaryGuardian.findById(updatedRecord.pickUpSecondaryGuardian);
        if(!guardian) {
            return next(new AttendanceError('Invalid secondary guardian.', 400, 'fail'))
        }
    }

    // Ensure the checkin user exists in the database.
    const checkOutUser = await User.findById(updatedRecord.checkedOutBy);
    if(!checkOutUser) {
        return next(new AttendanceError('Inavlid check-in user.', 400, 'fail'))
    }

    // If the out time was given set it to right now.
    if(!updatedRecord.timeOut) {
        updatedRecord.timeOut = new Date()
    }

    // Add the attendance record to the database.
    const record = await Attendance.findByIdAndUpdate(recordId, updatedRecord, {
        new: true,
    })

    res.status(201).json({
        status: 'success',
        data: {
            record
        }
    })    
});

const updateAttendance = errorCatcher(async (req, res, next) => {
    const attendanceRecordId = req.params?.id;

    // Get the update object
    const updatedRecord = {
        timeIn: req.body.timeIn,
        timeOut: req.body.timeOut,
    }

    // Remove any undefined keys.
    Object.keys(updatedRecord).forEach(key => updatedRecord[key] === undefined ? delete updatedRecord[key] : null);

    // Update the attendance record and return the new record.
    const updatedAttendanceRecord = await Attendance.findByIdAndUpdate(attendanceRecordId, updatedRecord, {
        new: true,
    })

    // If the id was invalid return an error.
    if(!updatedAttendanceRecord) {
        return next(new AttendanceError('The attendance record you are trying to update does not exist.', 400, 'fail'))
    }

    res.status(200).json({
        status: 'success',
        data: {
            updatedAttendanceRecord
        }
    })

})

const deleteAttendance = errorCatcher(async (req, res, next) => {
    const attendanceRecordId = req.params?.id;

    await Attendance.findByIdAndDelete(attendanceRecordId);

    res.status(204).json(null);
});

const getAttendance = errorCatcher(async (req, res, next) => {
    // Define the query
    const query = {
        child: req.query.child
    }

    // Remove any unwanted keys.
    Object.keys(query).forEach(key => query[key] === undefined ? delete query[key] : null);

    // Attempt to find attendance given the query.
    const attendance = await Attendance.find(query);

    // If no attendance was found return an error.
    if(attendance.length === 0) {
        return next(new AttendanceError(`Sorry, we couldn't find any attendance records given your search.`, 400, 'fail'));
    }

    // Send the attendance to the client.
    res.status(200).json({
        status: 'success',
        data: {
            attendance
        }
    })

})

const getAttendanceById = errorCatcher(async (req, res, next) => {
    // Define the query
    const attendanceRecordId = req.params?.id;

    // Attempt to find attendance given the query.
    const attendanceRecord = await Attendance.findById(attendanceRecordId);

    // If no attendance was found return an error.
    if(!attendanceRecord) {
        return next(new AttendanceError(`Sorry, we couldn't find any attendance for the given id.`, 400, 'fail'));
    }

    // Send the attendance to the client.
    res.status(200).json({
        status: 'success',
        data: {
            attendanceRecord
        }
    })

})

module.exports = {
    checkIn,
    checkOut,
    deleteAttendance,
    getAttendance,
    getAttendanceById,
    updateAttendance
}