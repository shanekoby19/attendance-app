const mongoose = require('mongoose');

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
        latitude: {
            type: Number,
            required: [true, 'A site must have a latitude.']
        },
        longitude: {
            type: Number,
            required: [true, 'A site must have a longitude.']
        }
    }
});

module.exports = mongoose.model('Site', siteSchema);
