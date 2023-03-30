const express = require('express');
const {
    addSecondaryGuardian,
} = require('../controllers/secondaryGuardianController');
const authController = require('../controllers/authController');

const secondaryGuardianRouter = express.Router({ mergeParams: true });

secondaryGuardianRouter
    .route('/')
    .post(authController.isAuthenticated, authController.isAuthorized('admin'), addSecondaryGuardian);

module.exports = secondaryGuardianRouter;