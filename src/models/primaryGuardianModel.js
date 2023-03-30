const mongoose = require('mongoose');
const { secondaryGuardianSchema } = require('./secondaryGuardianModel');

const primaryGuardianSchema = new mongoose.Schema({
    firstName: {
        type: 'String',
        required: [true, 'A primary guardian must have a first name.'],
        trim: true,
    },
    lastName: {
        type: 'String',
        required: [true, 'A primary guardian must have a last name.'],
        trim: true,
    },
    email: {
        type: 'String',
        required: [true, 'A primary guardian must have an email.'],
        unique: [true, 'This email is already in use, please contact our support team for more information.']
    },
    phoneNumber: {
        type: 'String',
        required: [true, 'A primary guardian must have a phone number.']
    },
    password: {
        type: 'String',
        required: [true, 'A primary guardian must have a password.']
    },
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Child',
    }],
    profileImage: {
        type: 'String',
        required: [true, 'A primary guardian must have a profile picture.']
    },
    secondaryGuardians: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SecondaryGuardian'
        }
    ]
});

primaryGuardianSchema.pre(/^find/, function(next) {
    this
        .populate('children')
        .populate('secondaryGuardians');

    next();
});

const PrimaryGuardian = mongoose.model('PrimaryGuardian', primaryGuardianSchema);

module.exports = {
    primaryGuardianSchema,
    PrimaryGuardian
}