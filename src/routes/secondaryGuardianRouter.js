const express = require('express');
const {
    addSecondaryGuardian,
    getSecondaryGuardians
} = require('../controllers/secondaryGuardianController');
const authController = require('../controllers/authController');

const secondaryGuardianRouter = express.Router({ mergeParams: true });

secondaryGuardianRouter
    .route('/')
    .get(authController.isAuthenticated, authController.isAuthorized('admin'), getSecondaryGuardians)
    .post(authController.isAuthenticated, authController.isAuthorized('admin'), addSecondaryGuardian);

module.exports = secondaryGuardianRouter;