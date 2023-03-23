const express = require('express');
const { 
    addChild,
    getChild,
    getChildById,
    updateChild,
    deleteChild
} = require('../controllers/childController');
const authController = require('../controllers/authController');

const childRouter = express.Router();

childRouter
    .route('/')
    .get(authController.isAuthenticated, authController.isAuthorized('admin'), getChild)
    .post(authController.isAuthenticated, authController.isAuthorized('admin'), addChild)

childRouter
    .route('/:id')
    .get(authController.isAuthenticated, authController.isAuthorized('admin'), getChildById)
    .patch(authController.isAuthenticated, authController.isAuthorized('admin'), updateChild)
    .delete(authController.isAuthenticated, authController.isAuthorized('admin'), deleteChild)

module.exports = childRouter;