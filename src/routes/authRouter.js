const express = require('express');
const { login, logout } = require('../controllers/authController');

const authRouter = express.Router();

authRouter
    .route('/')
    .post(login)
    .delete(logout)

module.exports = authRouter;

