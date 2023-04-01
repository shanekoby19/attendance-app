const { Program } = require('../models/programModel');
const { Site } = require('../models/siteModel');
const { Classroom } = require('../models/classroomModel');
const AttendanceError = require('../error/AttendanceError');
const errorCatcher = require('../error/errorCatcher');

const getPrograms = errorCatcher(async (req, res, next) => {
    const query = {
        _id: req.query.id,
        name: req.query.name,
    }

    // Remove unused query parameters.
    Object.keys(query).forEach(key => query[key] === undefined ? delete query[key] : null);

    // Perform the find operation
    const programs = await Program.find(query);

    if(programs.length === 0) {
        return next(new AttendanceError('Unable to find any programs given the parameters', 400, 'fail'));
    }

    // Send the programs back to the user.
    res.status(200).json({
        status: 'success',
        data: {
            programs
        }
    })
})

const addProgram = errorCatcher(async(req, res, next) => {
    // Create the program object from the request.
    const programToAdd = {
        name: req.body.name,
        sites: req.body.sites,
        admins: req.body.admins,
    }

    // Create the program in the database.
    const program = await Program.create(programToAdd);

    // Send the newly created program back to the client.
    res.status(201).json({
        status: 'success',
        data: {
            program
        }
    })
});

const updateProgram = errorCatcher(async(req, res, next) => {
    // Get the program id from the request parameters.
    const programId = req.params.id;

    // Create the program object from the request.
    const programUpdates = {
        name: req.body.name,
    }

    // Remove any unused properites
    Object.keys(programUpdates).forEach(key => programUpdates[key] === undefined ? delete programUpdates[key]: null);

    // Update the program in the database.
    const program = await Program.findByIdAndUpdate(programId, programUpdates, {
        new: true,
    });

    if(!program) {
        return next(new AttendanceError('Unable to find the a program with the given id', 400, 'fail'));
    }

    // Send the updated program back to the client.
    res.status(200).json({
        status: 'success',
        data: {
            program
        }
    })
});

const deleteProgram = errorCatcher(async(req, res, next) => {
    // Get the program id from the request parameters.
    const programId = req.params.id;

    // Get the program from the database
    const program = await Program.findById(programId);

    if(!program) {
        return next(new AttendanceError('Unable to find a program with that id', 400, 'fail'));
    }

    // Perform a cascade delete of all classrooms.
    const deletedSitePromises = program.sites.map(async (siteId) => {
        const site = await Site.findById(siteId);

        const deletedClassroomPromises = site.classrooms.map(async (classroomId) => await Classroom.findByIdAndDelete(classroomId));

        await Promise.all(deletedClassroomPromises);

        return await site.delete();
    });

    Promise.all(deletedSitePromises);

    // Try to delete the program from the database.
    await Program.findByIdAndDelete(programId);

    res.status(204).json({});
})


module.exports = {
    getPrograms,
    addProgram,
    updateProgram,
    deleteProgram,
}