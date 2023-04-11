const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
    name: {
        type: 'String',
        trim: true,
        required: [true, 'A classroom must have a name.'],
    },
    teachers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Child'
    }]
})

const Classroom = mongoose.model('Classroom', classroomSchema);

module.exports = {
    Classroom,
    classroomSchema
}