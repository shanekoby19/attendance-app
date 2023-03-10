const express = require('express');
const {
    getUsers,
    addUser
} = require('../controllers/userController');

const authController = require('../controllers/authController');

const userRouter = express.Router();

userRouter
    .route('/')
    .get(authController.isAuthorized('admin'), getUsers)
    .post(authController.isAuthorized('super admin'), addUser)

module.exports = userRouter;