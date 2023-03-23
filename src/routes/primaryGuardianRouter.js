const express = require('express');
const {
    addPrimaryGuardian,
    getPrimaryGuardian,
    getPrimaryGuardianById,
    updatePrimaryGuardian,
    deletePrimaryGuardian
} = require('../controllers/primaryGuardianController');
const authController = require('../controllers/authController');

const primaryGuardianRouter = express.Router();

primaryGuardianRouter
    .route('/')
    .get(authController.isAuthenticated, authController.isAuthorized('admin'), getPrimaryGuardian)
    .post(authController.isAuthenticated, authController.isAuthorized('admin'), addPrimaryGuardian);

primaryGuardianRouter
    .route('/:id')
    .get(authController.isAuthenticated, authController.isAuthorized('admin'), getPrimaryGuardianById)
    .patch(authController.isAuthenticated, authController.isAuthorized('admin'), updatePrimaryGuardian)
    .delete(authController.isAuthenticated, authController.isAuthorized('admin'), deletePrimaryGuardian)