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
const multer = require('multer');
const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });
const uploadImage = require('../controllers/imageController');


const primaryGuardianRouter = express.Router();

primaryGuardianRouter
    .route('/')
    .get(authController.isAuthenticated, authController.isAuthorized('admin'), getPrimaryGuardians)
    .post(authController.isAuthenticated, authController.isAuthorized('admin'), upload.single('profileImage'), uploadImage('', 'primary-guardians'), addPrimaryGuardian);

primaryGuardianRouter
    .route('/:id')
    .get(authController.isAuthenticated, authController.isAuthorized('admin'), getPrimaryGuardianById)
    .patch(authController.isAuthenticated, authController.isAuthorized('admin'), upload.single('profileImage'), uploadImage('optional', 'primary-guardians'), updatePrimaryGuardian)
    .delete(authController.isAuthenticated, authController.isAuthorized('admin'), deletePrimaryGuardian);

primaryGuardianRouter
    .use('/:id/children', childRouter)

primaryGuardianRouter
    .use('/:id/secondary-guardians', secondaryGuardianRouter);

module.exports = primaryGuardianRouter;