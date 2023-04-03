const express = require('express');
const {
    addSecondaryGuardian,
    getSecondaryGuardians,
    updateSecondaryGuardian,
    deleteSecondaryGuardian
} = require('../controllers/secondaryGuardianController');
const authController = require('../controllers/authController');

// Config multer storage and grab the uploadImage function
const multer = require('multer');
const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });
const uploadImage = require('../controllers/imageController');

const childRouter = express.Router({ mergeParams: true });

const secondaryGuardianRouter = express.Router({ mergeParams: true });

secondaryGuardianRouter
    .route('/')
    .get(authController.isAuthenticated, authController.isAuthorized('admin'), getSecondaryGuardians)
    .post(authController.isAuthenticated, authController.isAuthorized('admin'), upload.single('profileImage'), uploadImage('', 'secondary-guardians'), addSecondaryGuardian);

secondaryGuardianRouter
    .route('/:secondaryGuardianId')
    .patch(authController.isAuthenticated, authController.isAuthorized('admin'), upload.single('profileImage'), uploadImage('optional', 'secondary-guardians'), updateSecondaryGuardian)
    .delete(authController.isAuthenticated, authController.isAuthorized('admin'), deleteSecondaryGuardian)

module.exports = secondaryGuardianRouter;