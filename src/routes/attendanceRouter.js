const express = require('express');
const {
    checkIn,
    checkOut,
    deleteAttendance,
    getAttendance,
    getAttendanceById,
    updateAttendance
} = require('../controllers/attendanceController');
const authController = require('../controllers/authController');

const attendanceRouter = express.Router();

attendanceRouter
    .route('/')
    .get(authController.isAuthenticated, authController.isAuthorized('admin'), getAttendance)

attendanceRouter
    .route('/:id')
    .get(authController.isAuthenticated, authController.isAuthorized('admin'), getAttendanceById)
    .patch(authController.isAuthenticated, authController.isAuthorized('admin'), updateAttendance)
    .delete(authController.isAuthenticated, authController.isAuthorized('admin'), deleteAttendance)

attendanceRouter
    .route('/checkin')
    .post(authController.isAuthenticated, authController.isAuthorized('admin'), checkIn)

attendanceRouter
    .route('/checkout/:id')
    .patch(authController.isAuthenticated, authController.isAuthorized('admin'), checkOut)

module.exports = attendanceRouter;