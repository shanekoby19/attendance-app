const mongoose = require('mongoose');

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
    primaryGuardian: {
        type: mongoose.Schema.ObjectId,
        ref: 'PrimaryGuardian',
        required: [true, 'A child must have a primary guardian.']
    }
});

const Child = mongoose.model('Child', childSchema);

module.exports = {
    childSchema,
    Child
}