const express = require('express');
const {
    getClassroomById,
    getClassrooms,
    addClassroom,
    updateClassroom,
    deleteClassroom
} = require('../controllers/classroomController');
const authController = require('../controllers/authController');

const classroomRouter = express.Router({ mergeParams: true });

classroomRouter
    .route('/')
    .get(authController.isAuthenticated, getClassrooms)
    .post(authController.isAuthenticated, authController.isAuthorized('admin'), addClassroom);

classroomRouter
    .route('/:classroomId')
    .get(authController.isAuthenticated, getClassroomById)
    .patch(authController.isAuthenticated, authController.isAuthorized('admin'), updateClassroom)
    .delete(authController.isAuthenticated, authController.isAuthorized('super admin'), deleteClassroom);


module.exports = classroomRouter;