const mongoose = require('mongoose');
const { secondaryGuardianSchema } = require('./secondaryGuardianModel');
const { primaryGuardianSchema } = require('./primaryGuardianModel');
const { userSchema } = require('./userModel');

const attendanceSchema = new mongoose.Schema({
    timeIn: {
        type: 'Date',
        default: new Date(),
    },
    timeOut: {
        type: 'Date',
        default: new Date(),
    },
    dropOffParent: {
        type: primaryGuardianSchema,
    },
    dropOffGuardian: {
        type: secondaryGuardianSchema,
    },
    checkedInBy: {
        type: userSchema,
    },
    pickUpParent: {
        type: primaryGuardianSchema,
    },
    pickUpGuardian: {
        type: secondaryGuardianSchema,
    },
    checkedOutBy: {
        type: userSchema,
    }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = {
    attendanceSchema,
    Attendance
}