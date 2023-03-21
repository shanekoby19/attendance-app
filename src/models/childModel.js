const mongoose = require('mongoose');
const { attendanceSchema } = require('./attendanceModel');

const childSchema = new mongoose.Schema({
    firstName: {
        type: 'String',
        required: [true, 'A child must have a first name.'],
        trim: true,
    },
    lastName: {
        type: 'String',
        required: [true, 'A parent must have a first name.'],
        trim: true,
    },
    profileImage: {
        type: 'String',
        required: [true, 'A parent must have a profile picture.']
    },
    attendance: {
        type: [attendanceSchema]
    }
});

const Child = mongoose.model('Child', childSchema);

module.exports = {
    childSchema,
    Child
}