const {
    getAllKeys,
    addKey
} = require('../controllers/keyController');

const authController = require('../controllers/authController')

const express = require('express');

const keyRouter = express.Router();

keyRouter
    .route('/')
    .get(authController.login, authController.isAuthorized('super admin'), getAllKeys)
    .post(addKey)
    
module.exports = keyRouter;