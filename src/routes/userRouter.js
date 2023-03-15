const express = require('express');
const {
    getUsers,
    addUser
} = require('../controllers/userController');

const authController = require('../controllers/authController');

const userRouter = express.Router();

userRouter
    .route('/')
    .get(authController.isAuthenticated, authController.isAuthorized('admin'), getUsers)
    .post(authController.isAuthenticated, authController.isAuthorized('super admin'), addUser)

module.exports = userRouter;