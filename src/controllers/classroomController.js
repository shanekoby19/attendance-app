const { Classroom } = require('../models/classroomModel');
const { Site } = require('../models/siteModel');

const errorCatcher = require('../error/errorCatcher');
const AttendanceError = require('../error/AttendanceError');

const getClassroomById = errorCatcher(async (req, res, next) => {
    // Get the classroom id from the request parameters.
    const classroomId = req.params.classroomId;

    // Attempt to find the classroom with the given id.
    const classroom = await Classroom.findById(classroomId);

    if(!classroom) {
        return next(new AttendanceError('Unable to find a classroom with the given id', 400, 'fail'));
    }

    // Return the classroom to the client.
    res.status(200).json({
        status: 'success',
        data: {
            classroom
        }
    })
});

const getClassrooms = errorCatcher(async (req, res, next) => {
    const query = {
        name: req.query.name,
    }

    // Remove any unused query properties.
    Object.keys(query).forEach(key => query[key] === undefined ? delete query[key] : null);

    // Attempt to find a classroom that matches the query.
    const classrooms = await Classroom.find(query);

    if(classrooms.length === 0) {
        return next(new AttendanceError('Unable to find any classrooms with the search criteria.', 400, 'fail'));
    }

    // Return any found classrooms to the client.
    res.status(200).json({
        status: 'success',
        data: {
            classrooms
        }
    })
});

const addClassroom = errorCatcher(async (req, res, next) => {
    // Get the siteId from the request parameters
    const siteId = req.params.siteId;

    // Ensure the site exists in the database.
    const site = await Site.findById(siteId);

    if(!site) {
        return next(new AttendanceError('We are unable to find a site with the given id', 400, 'fail'));
    }

    // Create the new classroom object.
    const newClassroom = {
        name: req.body.name,
        teachers: req.body.teachers,
        children: req.body.children
    }

    // Attempt to create the classroom in the database.
    const classroom = await Classroom.create(newClassroom);

    // Add the classroom id to the site object.
    site.classrooms.push(classroom._id);
    await site.save();

    // Send the newly created classroom back to the client
    res.status(201).json({
        status: 'success',
        data: {
            classroom
        }
    });
});

const updateClassroom = errorCatcher(async(req, res, next) => {
    // Get the classroom id from the request parameters.
    const classroomId = req.params.classroomId;

    const classroomUpdates = {
        name: req.body.name,
        teachers: req.body.teachers,
        children: req.body.children,
    }

    // remove any unused fields.
    Object.keys(classroomUpdates).forEach(key => classroomUpdates[key] === undefined ? delete classroomUpdates[key] : null);

    // Try to update the classroom in the database.
    const updatedClassroom = await Classroom.findByIdAndUpdate(classroomId, classroomUpdates, {
        new: true,
    });

    if(!updatedClassroom) {
        return next(new AttendanceError('Unable to find a classroom with the given id', 400, 'fail'));
    }

    // Return the updated classroom to the client.
    res.status(200).json({
        status: 'success',
        data: {
            updatedClassroom
        }
    });
});

const deleteClassroom = errorCatcher(async (req, res, next) => {
    // Get the site id from the request parameters.
    const siteId = req.params.siteId;

    // Ensure the site exists in the database.
    const site = await Site.findById(siteId);

    if(!site) {
        return next(new AttendanceError('We could not find a site with the given id in the database.', 400, 'fail'));
    }

    // Get the classroom id from the request parameters.
    const classroomId = req.params.classroomId;

    // Ensure the classroom exists in the database.
    const classroom = Classroom.findById(classroomId);

    if(!classroom) {
        return next(new AttendanceError('We could not find a classroom with the given id', 400, 'fail'));
    }

    // Remove the classroom from the site.
    site.classrooms = site.classrooms.filter(id => id.toString() !== classroomId);
    await site.save();

    // Delete the classroom from the database.
    await Classroom.findByIdAndDelete(classroomId);

    // Send a no-content success message to the client.
    res.status(204).json({})
});

module.exports = {
    getClassroomById,
    getClassrooms,
    addClassroom,
    updateClassroom,
    deleteClassroom
}