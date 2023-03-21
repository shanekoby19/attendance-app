const mongoose = require('mongoose');

const guardianSchema = new mongoose.Schema({
    firstName: {
        type: 'String',
        required: [true, 'A guardian must have a first name.'],
        trim: true,
    },
    lastName: {
        type: 'String',
        required: [true, 'A guardian must have a last name.'],
        trim: true,
    },
    email: {
        type: 'String',
        required: [true, 'A guardian must have an email.'],
        unique: [true, 'This email is already in use, please contact our support team for more information.']
    },
    phoneNumber: {
        type: 'String',
        required: [true, 'A guardian must have a phone number.']
    },
    profileImage: {
        type: 'String',
        required: [true, 'A guardian must have a profile image']
    }
});

const Guardian = mongoose.model('Guardian', guardianSchema);

module.exports = {
    guardianSchema,
    Guardian
}