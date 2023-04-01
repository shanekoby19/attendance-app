const express = require('express');
const {
    addSecondaryGuardian,
    getSecondaryGuardians,
    updateSecondaryGuardian,
    deleteSecondaryGuardian
} = require('../controllers/secondaryGuardianController');
const authController = require('../controllers/authController');

const secondaryGuardianRouter = express.Router({ mergeParams: true });

secondaryGuardianRouter
    .route('/')
    .get(authController.isAuthenticated, authController.isAuthorized('admin'), getSecondaryGuardians)
    .post(authController.isAuthenticated, authController.isAuthorized('admin'), addSecondaryGuardian);

secondaryGuardianRouter
    .route('/:secondaryGuardianId')
    .patch(authController.isAuthenticated, authController.isAuthorized('admin'), updateSecondaryGuardian)
    .delete(authController.isAuthenticated, authController.isAuthorized('admin'), deleteSecondaryGuardian)

module.exports = secondaryGuardianRouter;