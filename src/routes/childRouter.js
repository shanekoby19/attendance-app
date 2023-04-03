const express = require('express');
const { 
    addChild,
    getChildren,
    getChildById,
    updateChild,
    deleteChild
} = require('../controllers/childController');
const authController = require('../controllers/authController');

// Config multer storage and grab the uploadImage function
const multer = require('multer');
const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });
const uploadImage = require('../controllers/imageController');

const childRouter = express.Router({ mergeParams: true });

childRouter
    .route('/')
    .get(authController.isAuthenticated, authController.isAuthorized('admin'), getChildren)
    .post(authController.isAuthenticated, authController.isAuthorized('admin'), upload.single('profileImage'), uploadImage('', 'children'), addChild)

childRouter
    .route('/:childId')
    .get(authController.isAuthenticated, authController.isAuthorized('admin'), getChildById)
    .patch(authController.isAuthenticated, authController.isAuthorized('admin'), upload.single('profileImage'), uploadImage('optional', 'children'), updateChild)
    .delete(authController.isAuthenticated, authController.isAuthorized('admin'), deleteChild)

module.exports = childRouter;