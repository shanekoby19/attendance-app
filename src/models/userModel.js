const mongoose = require('mongoose');
const { Schema } = mongoose

const userSchema = new Schema({
    firstName: {
        type: 'String',
        required: [true, 'A user must have a first name.'],
        trim: true,
    },
    lastName: {
        type: 'String',
        required: [true, 'A user must have a first name.'],
        trim: true,
    },
    email: {
        type: 'String',
        required: [true, 'A user must have an email.'],
        unique: [true, 'This email is already in use, please contact our support team for more information.']
    },
    password: {
        type: 'String',
        required: [true, 'A user must have a password.']
    },
    role: {
        type: 'String',
        required: [true, 'A user must have a role.'],
        enum: {
            values: ['viewer', 'admin', 'super admin'],
            message: 'The user role must be one of the following values: viewer, admin, super admin'
        }
    }
})

const User = mongoose.model('User', userSchema);

module.exports = {
    User,
    userSchema
}