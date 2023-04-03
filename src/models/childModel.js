const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
    firstName: {
        type: 'String',
        required: [true, 'A child must have a first name.'],
        trim: true,
    },
    lastName: {
        type: 'String',
        required: [true, 'A child must have a last name.'],
        trim: true,
    },
    profileImage: {
        type: 'String',
        required: [true, 'A child must have a profile picture.']
    }
});

const Child = mongoose.model('Child', childSchema);

module.exports = {
    childSchema,
    Child
}