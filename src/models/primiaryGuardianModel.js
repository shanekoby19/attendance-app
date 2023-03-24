const mongoose = require('mongoose');
const { childSchema } = require('./childModel');
const { guardianSchema } = require('./secondaryGuardianModel');

const parentSchema = new mongoose.Schema({
    firstName: {
        type: 'String',
        required: [true, 'A parent must have a first name.'],
        trim: true,
    },
    lastName: {
        type: 'String',
        required: [true, 'A parent must have a first name.'],
        trim: true,
    },
    email: {
        type: 'String',
        required: [true, 'A parent must have an email.'],
        unique: [true, 'This email is already in use, please contact our support team for more information.']
    },
    phoneNumber: {
        type: 'String',
        required: [true, 'A parent must have a phone number.']
    },
    password: {
        type: 'String',
        required: [true, 'A parent must have a password.']
    },
    children: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Child',
        },
    ],
    profileImage: {
        type: 'String',
        required: [true, 'A parent must have a profile picture.']
    },
    additionalGuardians: {
        type: [guardianSchema]
    }
});

const Parent = mongoose.model('Parent', parentSchema);

module.exports = {
    parentSchema,
    Parent
}