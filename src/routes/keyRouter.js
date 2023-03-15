const {
    getAllKeys,
    addKey
} = require('../controllers/keyController');

const authController = require('../controllers/authController')

const express = require('express');

const keyRouter = express.Router();

keyRouter
    .route('/')
    .get(authController.isAuthenticated, authController.isAuthorized('super admin'), getAllKeys)
    .post(authController.isAuthenticated, authController.isAuthorized('super admin'), addKey)
    
module.exports = keyRouter;