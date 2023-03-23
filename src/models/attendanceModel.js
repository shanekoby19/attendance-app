const mongoose = require('mongoose');
const { guardianSchema } = require('./secondaryGuardianModel');
const { parentSchema } = require('./primaryGuardianModel');
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
        type: parentSchema,
    },
    dropOffGuardian: {
        type: guardianSchema,
    },
    checkedInBy: {
        type: userSchema,
    },
    pickUpParent: {
        type: parentSchema,
    },
    pickUpGuardian: {
        type: guardianSchema,
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