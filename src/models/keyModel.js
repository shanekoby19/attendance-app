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
        required: [true, 'An api key must have a key value.'],
        unique: [true, 'The key value must be unique for each api key.']
    }
});

const Key = mongoose.model('Key', keySchema);

module.exports = {
    Key,
    keySchema
}