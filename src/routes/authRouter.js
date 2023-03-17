const express = require('express');
const { login, logout, isAuthenticated, getAuthUser } = require('../controllers/authController');

const authRouter = express.Router();

authRouter
    .route('/login')
    .get(isAuthenticated, getAuthUser)
    .post(login)

authRouter
    .route('/logout')
    .delete(logout)

module.exports = authRouter;

