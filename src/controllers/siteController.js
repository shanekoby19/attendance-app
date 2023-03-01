const Site = require('../models/siteModel');
const { Client } = require('@googlemaps/google-maps-services-js');
const mongoose = require('mongoose');

const getSites = async (req, res) => {
    const nearbySites = await Site.aggregate([
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [-115.2011961, 36.2189202]
                },
                distanceMultiplier: 0.000621371,
                distanceField: "distance",
            }
        }
    ])

    res.status(200).json({
        status: 'success',
        data: {
            nearbySites: nearbySites
        }
    })
};

const getSiteById = async (req, res) => {
    const { id: siteId } = req.params;
    const site = await Site.find({ _id: siteId });

    res.status(200).json({
        status: 'success',
        data: {
            site: site
        }
    });
};

const createSite = async (req, res) => {

    const newSite = await Site.create({
        program: req.body.program,
        site: req.body.site,
        location: {
            address: req.body.location.address,
            city: req.body.location.city,
            state: req.body.location.state,
            zip: req.body.location.zip,
            coords: {
                coordinates: req.body.location.coords
            }
        }
    });

    res.status(201).json({
        status: 201,
        data: {
            site: newSite
        }
    })
}

const updateSite = async (req, res) => {
    const { id: siteId } = req.params;

    const updatedSite = await Site.findByIdAndUpdate(mongoose.Types.ObjectId(siteId), {
        ...req.body
    }, { 
        new: true
    })

    res.status(200).json({
        status: 200,
        data: {
            updateSite: updatedSite
        }
    });
}

const checkId = (req, res, next, id) => {
    // TODO

    // Check to see if id is valid in mongodb.

    // Find and store the site object on the request.
    
    console.log('Id is good!')

    next();
};

const getCoordinates = async (req, res, next) => {
    // Destructor the location components from the request body.
    const { address, city, state, zip } = req.body.location;
    const fullAddress = `${address} ${city}, ${state} ${zip}`

    // Define a few options for client.geocode method.
    const args = {
        params: {
            key: process.env.GOOGLE_MAPS_API_KEY,
            address: fullAddress
        }
    }

    const client = new Client();

    // Try to get the geolocation data.
    // If successful we will store it on the req.body.location object
    try {
        const { data } = await client.geocode(args);
        req.body.location.coords = [data.results[0].geometry.location.lng, data.results[0].geometry.location.lat];
    }
    catch(err) {
        console.log(err);
    }

    next();
}


module.exports = {
    getSites,
    getSiteById,
    createSite,
    updateSite,
    checkId,
    getCoordinates,
}