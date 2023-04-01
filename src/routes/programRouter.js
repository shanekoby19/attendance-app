const express = require('express');
const {
    addProgram,
    updateProgram,
    deleteProgram,
    getPrograms
} = require('../controllers/programController');
const authController = require('../controllers/authController');

const programRouter = express.Router();

programRouter
    .route('/')
    .get(authController.isAuthenticated, getPrograms)
    .post(authController.isAuthenticated, authController.isAuthorized('admin'), addProgram);

programRouter
    .route('/:id')
    .patch(authController.isAuthenticated, authController.isAuthorized('admin'), updateProgram)
    .delete(authController.isAuthenticated, authController.isAuthorized('super admin'), deleteProgram);

module.exports = programRouter;