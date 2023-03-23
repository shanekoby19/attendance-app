const mongoose = require('mongoose');

const secondaryGuardianSchema = new mongoose.Schema({
    firstName: {
        type: 'String',
        required: [true, 'A secondary guardian must have a first name.'],
        trim: true,
    },
    lastName: {
        type: 'String',
        required: [true, 'A secondary guardian must have a last name.'],
        trim: true,
    },
    email: {
        type: 'String',
        required: [true, 'A secondary guardian must have an email.'],
        unique: [true, 'This email is already in use, please contact our support team for more information.']
    },
    phoneNumber: {
        type: 'String',
        required: [true, 'A secondary guardian must have a phone number.']
    },
    profileImage: {
        type: 'String',
        required: [true, 'A secondary guardian must have a profile image']
    }
});

const SecondaryGuardian = mongoose.model('SecondaryGuardian', secondaryGuardianSchema);

module.exports = {
    secondaryGuardianSchema,
    SecondaryGuardian
}