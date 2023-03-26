const express = require('express');
const { 
    addChild,
    getChildren,
    getChildById,
    updateChild,
    deleteChild
} = require('../controllers/childController');
const authController = require('../controllers/authController');

const childRouter = express.Router({ mergeParams: true });

childRouter
    .route('/')
    .get(authController.isAuthenticated, authController.isAuthorized('admin'), getChildren)
    .post(authController.isAuthenticated, authController.isAuthorized('admin'), addChild)

childRouter
    .route('/:childId')
    .get(authController.isAuthenticated, authController.isAuthorized('admin'), getChildById)
    .patch(authController.isAuthenticated, authController.isAuthorized('admin'), updateChild)
    .delete(authController.isAuthenticated, authController.isAuthorized('admin'), deleteChild)

module.exports = childRouter;