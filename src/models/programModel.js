const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'A program must have a name'],
    },
    sites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Site',
    }],
    admins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }]
})

const Program = mongoose.model('Program', programSchema);

module.exports = {
    Program,
    programSchema
}