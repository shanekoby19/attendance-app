const mongoose = require('mongoose');
const { Schema } = mongoose;

const keySchema = new Schema({
    name: {
        type: 'String',
        required: [true, 'An api key must have a name.'],
        uppercase: true,
    },
    key: {
        type: 'String', 
        required: [true, 'An api key must have a key value.']
    }
});

module.exports = mongoose.model('Key', keySchema);