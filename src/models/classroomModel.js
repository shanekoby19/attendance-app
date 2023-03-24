const mongoose = require('mongoose');
const { userSchema } = require('./userModel');
const { childSchema } = require('./childModel');

const classroomSchema = new mongoose.Schema({
    name: {
        type: 'String',
        trim: true,
        required: [true, 'A classroom must have a name.'],
    },
    admins: {
        type: [userSchema]
    },
    teacher: {
        type: userSchema
    },
    teacherAssistant: {
        type: userSchema
    },
    children: {
        type: [childSchema]
    }
})

const Classroom = mongoose.model('Classroom', classroomSchema);

module.exports = {
    Classroom,
    classroomSchema
}