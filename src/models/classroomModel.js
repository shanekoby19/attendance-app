const mongoose = require('mongoose');
const { userSchema } = require('./userModel');

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
    }
})

const Classroom = mongoose.model('Classroom', classroomSchema);

module.exports = {
    Classroom,
    classroomSchema
}