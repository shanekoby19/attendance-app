const { Site } = require('../models/siteModel');
const { Program } = require('../models/programModel');
const { Classroom } = require('../models/classroomModel');
const { Client } = require('@googlemaps/google-maps-services-js');

const errorCatcher = require('../error/errorCatcher');
const AttendanceError = require('../error/AttendanceError');

const getSites = errorCatcher(async (req, res) => {
    // Define a boolean flag to determine if a match stage was used.
    let matchStageUsed = false;

    // Define the base pipeline query.
    const pipeline = [];

    // Pass the geonear stage only if a longitude and latitude are present in the query.
    if(req.query.lng && req.query.lat) {
        pipeline.push({
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [Number(req.query.lng), Number(req.query.lat)]
                },
                distanceMultiplier: 0.000621371,
                distanceField: "distance.miles"
            } 
        })
    }


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
});

const getSiteById = errorCatcher( async(req, res, next) => {
    const siteId = req.params.siteId;

    const site = await Site.findById(siteId);

    if(!site) {
        return next(new AttendanceError('Unable to find a site with the given id', 400, 'fail'));
    }

    res.status(200).json({
        status: 'success',
        data: {
            site: site
        }
    });
});

const addSite = errorCatcher(async (req, res, next) => {
    // Get the program id from the request parameters.
    const programId = req.params.id;

    // Find the program in the database.
    const program = await Program.findById(programId);

    if(!program) {
        return next(new AttendanceError('Unable to find a program with the given id', 400, 'fail'));
    }

    // Define the new site.
    const newSite = await Site.create({
        name: req.body.name,
        classrooms: req.body.classrooms,
        admins: req.body.admins,
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

    // Add the new site to the program.
    program.sites.push(newSite._id);

    await program.save();

    res.status(201).json({
        status: 201,
        data: {
            site: newSite
        }
    })
});

const updateSite = errorCatcher(async (req, res, next) => {
    // Get the site id from the request parameters.
    const siteId = req.params.siteId;

    // Define the update object.
    const siteUpdates = {
        name: req.body.name,
        classrooms: req.body.classrooms,
        admins: req.body.admins,
        location: {
            address: req.body.location?.address,
            city: req.body.location?.city,
            state: req.body.location?.state,
            zip: req.body.location?.zip,
            coords: {
                coordinates: req.body.location?.coords,
                type: 'Point'
            }
        }
    }

    // Remove any unused fields.
    Object.keys(siteUpdates).forEach(key => siteUpdates[key] === undefined ? delete siteUpdates[key] : null);

    // Remove location key if it isn't used
    if(!req.body.location) {
        delete siteUpdates["location"]
    }

    // Attempt to update the site.
    const updatedSite = await Site.findByIdAndUpdate(siteId, siteUpdates, {
        new: true
    });

    if(!updatedSite) {
        return next(new AttendanceError('The site id given in the request is invalid.', 400, 'fail'));
    }

    res.status(200).json({
        status: 200,
        data: {
            updatedSite
        }
    });
});

const getCoordinates = errorCatcher(async (req, res, next) => {
    // If a location isn't passed call the next middleware immediately. Used for passive updates.
    if(!req.body.location) {
        return next();
    }

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
    const { data } = await client.geocode(args);
    req.body.location.coords = [data.results[0].geometry.location.lng, data.results[0].geometry.location.lat];

    next();
});

const deleteSite = errorCatcher(async (req, res, next) => {
    // Get the program id from the request parameters.
    const programId = req.params.id;

    // Find the program in the database.
    const program = await Program.findById(programId);

    if(!program) {
        return next(new AttendanceError('The program you are trying to update does not exist', 400, 'fail'));
    }

    // Attempt to find the site in the database.
    const siteId = req.params.siteId;
    const site = await Site.findById(siteId);

    if(!site) {
        return next(new AttendanceError('Unable to find the site you are trying to delete', 400, 'fail'));
    }

    // Delete all the classrooms at this site.
    const deletedClassroomPromises = site.classrooms.map(async (classroom) => await Classroom.findByIdAndDelete(classroom._id));
    await Promise.all(deletedClassroomPromises);

    // Delete the site in the database.
    await Site.findByIdAndDelete(siteId);

    // If the site is successfully deleted, remove it from the parent program.
    program.sites = program.sites.filter(id => id.toString() !== siteId);

    await program.save();

    res.status(204).json({});
});

module.exports = {
    getSites,
    getSiteById,
    addSite,
    updateSite,
    getCoordinates,
    deleteSite
}