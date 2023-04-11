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
});

userSchema.index({ email: 1, }, { 
    unique: true,
    partialFilterExpression: { email: { $ne: null } } 
});

const User = mongoose.model('User', userSchema);

module.exports = {
    User,
    userSchema
}