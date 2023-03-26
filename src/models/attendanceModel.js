const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    timeIn: {
        type: 'Date',
        default: new Date(),
        required: [true, 'The check-in time is required to create an attendance record.']
    },
    timeOut: {
        type: 'Date',
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
        ref: 'User',
        required: [true, 'A user is required to check-in a child.']
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

attendanceSchema.pre(/^find/, function(next) {
    this
        .populate('child')
        .populate('checkedInBy')
        .populate('checkedOutBy')
        .populate('dropOffPrimaryGuardian')
        .populate('pickUpPrimaryGuardian')
        .populate('dropOffSecondaryGuardian')
        .populate('pickUpSecondaryGuardian')

    next();
})

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = {
    attendanceSchema,
    Attendance
}