const mongoose = require('mongoose');
const { classroomSchema } = require('./classroomModel');

const siteSchema = new mongoose.Schema({
    program: {
        type: String,
        required: [true, 'A site must have a program name.'],
        enum: [{
            values: ['Clark County', 'Monmouth Middlesex', 'Wisconsin', 'Camden Philadelphia'],
            message: '{VALUE} is not a supported program please use "Clark County", "Monmouth Middlesex", "Wisconsin", or "Camden Philadelphia".'
        }]
    },
    site: {
        type: String,        
        required: [true, 'A site must have a name.']
    },
    classrooms: {
        type: [classroomSchema]
    },
    location: {
        address: {
            type: String,
            required: [true, 'Address is required to create a new site.']
        },
        city: {
            type: 'String',
            required: [true, 'A site must have a city.']
        },
        state: {
            type: 'String',
            required: [true, 'A site must have a state.']
        },
        zip: {
            type: String,
            required: [true, 'A site must have a zip code.']
        },
        coords: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
                required: true
            },
            coordinates: {
                type: [Number],
                minlength: [2, 'You must provide a latitude and a longitude for this coordinate point.'],
                maxLength: [2, 'You must only provide two coordinate points for this geoJSON object (lat, lon).']
            }
        }
    }
});

// Create a 2dsphere index on the siteSchema to speed up our geo queries.
siteSchema.index({ "location.coords": '2dsphere' });

module.exports = mongoose.model('Site', siteSchema);
