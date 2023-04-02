const express = require('express');
const {
    getSites,
    getSiteById,
    addSite,
    updateSite,
    deleteSite,
    getCoordinates
} = require('../controllers/siteController');
const authController = require('../controllers/authController');
const classroomRouter = require('../routes/classroomRouter');

const siteRouter = express.Router({ mergeParams: true });

siteRouter
    .route('/')
    .get(authController.isAuthenticated, getSites)
    .post(authController.isAuthenticated, authController.isAuthorized('admin'), getCoordinates, addSite)
    
siteRouter
    .route('/:siteId')
    .get(authController.isAuthenticated, getSiteById)
    .patch(authController.isAuthenticated, authController.isAuthorized('admin'), getCoordinates, updateSite)
    .delete(authController.isAuthenticated, authController.isAuthorized('super admin'), deleteSite);

siteRouter
    .use('/:siteId/classrooms', classroomRouter);

module.exports = siteRouter;