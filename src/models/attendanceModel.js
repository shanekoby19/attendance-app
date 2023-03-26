const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    timeIn: {
        type: 'Date',
        default: new Date(),
    },
    timeOut: {
        type: 'Date',
        default: new Date(),
    },
    dropOffPrimaryGuardian: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PrimaryGuardian'
    },
    dropOffSecondaryGuardian: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SecondaryGuardian'
    },
    checkedInBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    pickUpPrimaryGuardian: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PrimaryGuardian'
    },
    pickUpSecondaryGuardian: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SecondaryGuardian'
    },
    checkedOutBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    child: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Child',
        required: [true, 'An attendance record must belong to a child.']
    }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = {
    attendanceSchema,
    Attendance
}