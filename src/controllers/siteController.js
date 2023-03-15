const Site = require('../models/siteModel');
const { Client } = require('@googlemaps/google-maps-services-js');
const mongoose = require('mongoose');

const errorCatcher = require('../error/errorCatcher');
const AttendanceError = require('../error/AttendanceError');

const getSites = async (req, res) => {
    // Define a boolean flag to determine if a match stage was used.
    let matchStageUsed = false;

    // Define the base pipeline query to select all points within your current location.
    const pipeline = [
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [Number(req.query.lng), Number(req.query.lat)]
                },
                distanceMultiplier: 0.000621371,
                distanceField: "distance.miles"
            },   
        }
    ];


    // Define the match stage early as there might be multiple match objects.
    let matchStage = {
        $match: {
            "distance.miles": null
        }
    };

    // Loop through every query string and place it into it's pipeline stage.
    const entries = Object.entries(req.query);
    entries.forEach(([key, value]) => {

        // Define match parameters if listed
        if(key === 'distance') {
            let [operator, amount] = Object.entries(value)[0];

            matchStage.$match["distance.miles"] = {
                [`$${operator}`]: Number(amount)
            }
            matchStageUsed = true;
        }
        else if(key === 'program') {
            matchStage.$match.program = value;
            matchStageUsed = true;
        }
        else if(key === 'site') {
            matchStage.$match.site = value;
            matchStageUsed = true;
        }

        // Define skip parameters if listed
        if(key === 'skip') {
            pipeline.push({ $skip: Number(value) });
        }

        // Define limit parameters if listed
        if(key === 'limit') {
            pipeline.push({ $limit: Number(value) });
        }

        // Define the sort parameters if listed
        if(key === 'sort') {
            const [field, sortOrder] = Object.entries(value)[0];

            pipeline.push({ $sort: { [field]: Number(sortOrder)} })
        }
    });

    // If the distance object in the match stage is never used delete it.
    if(!matchStage.$match["distance.miles"]) {
        delete matchStage.$match["distance.miles"];
    }
    

    // If any of the match stage parameters were found push the matchStage onto the pipeline.
    if(matchStageUsed) {
        pipeline.push(matchStage);
    }

    // Push on a project stage to round miles and get distance in feet.
    pipeline.push({
        $project: {
            program: 1,
            site: 1,
            location: 1,
            "distance.miles": {
                $round: ["$distance.miles", 2]
            },
            "distance.feet": {
                $round: [{ $multiply: ["$distance.miles", 5280] }]
            }
        }
    });

    const nearbySites = await Site.aggregate(pipeline)

    res.status(200).json({
        status: 'success',
        data: {
            nearbySites: nearbySites
        }
    })
};

const getSiteById = errorCatcher( async(req, res, next) => {
    const { id: siteId } = req.params;

    const site = await Site.findById(siteId);

    res.status(200).json({
        status: 'success',
        data: {
            site: site
        }
    });
});

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

const deleteSite = async (req, res) => {
    try {
        await Site.findOneAndDelete(mongoose.Types.ObjectId(req.params.id));
        res.status(204).json({
            status: 'success',
            data: null
        })
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid site id'
        })
    }
}

module.exports = {
    getSites,
    getSiteById,
    createSite,
    updateSite,
    getCoordinates,
    deleteSite
}