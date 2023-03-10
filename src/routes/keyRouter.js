const {
    getAllKeys,
    addKey
} = require('../controllers/keyController');

const express = require('express');

const keyRouter = express.Router();

keyRouter
    .route('/')
    .get(getAllKeys)
    .post(addKey)
    
module.exports = keyRouter;