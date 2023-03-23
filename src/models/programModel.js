const mongoose = require('mongoose');
const { siteSchema } = require('./siteModel');
const { userSchema } = require('./userModel');

const programSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'A program must have a name'],
    },
    sites: {
        type: [siteSchema],
    },
    admins: {
        type: [userSchema],
    }
})