const express = require('express');
const {
    addPrimaryGuardian,
    getPrimaryGuardians,
    getPrimaryGuardianById,
    updatePrimaryGuardian,
    deletePrimaryGuardian
} = require('../controllers/primaryGuardianController');
const authController = require('../controllers/authController');
const childRouter = require('./childRouter');
const secondaryGuardianRouter = require('../routes/secondaryGuardianRouter');

const primaryGuardianRouter = express.Router();

primaryGuardianRouter
    .route('/')
    .get(authController.isAuthenticated, authController.isAuthorized('admin'), getPrimaryGuardians)
    .post(authController.isAuthenticated, authController.isAuthorized('admin'), addPrimaryGuardian);

primaryGuardianRouter
    .route('/:id')
    .get(authController.isAuthenticated, authController.isAuthorized('admin'), getPrimaryGuardianById)
    .patch(authController.isAuthenticated, authController.isAuthorized('admin'), updatePrimaryGuardian)
    .delete(authController.isAuthenticated, authController.isAuthorized('admin'), deletePrimaryGuardian);

primaryGuardianRouter
    .use('/:id/children', childRouter)

primaryGuardianRouter
    .use('/:id/secondary-guardians', secondaryGuardianRouter);

module.exports = primaryGuardianRouter;