const mongoose = require('mongoose');
const { classroomSchema } = require('./classroomModel');

const siteSchema = new mongoose.Schema({
    name: {
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
        },
        required: [true, 'A site must have a location']
    }
});

// Create a 2dsphere index on the siteSchema to speed up our geo queries.
siteSchema.index({ "location.coords": '2dsphere' });

const Site = mongoose.model('Site', siteSchema);

module.exports = {
    Site,
    siteSchema
}
