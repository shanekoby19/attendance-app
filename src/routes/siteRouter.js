const express = require('express');
const siteController = require('../controllers/siteController');

const siteRouter = express.Router();

// Add middleware that checks on the id to ensure it's valid before continuing.
siteRouter.param('id', siteController.checkId);

siteRouter
    .route('/')
    .get(siteController.getAllSites)
    .post(siteController.getCoordinates, siteController.createSite)
    
siteRouter
    .route('/:id')
    .get(siteController.getSiteById)
    .patch(siteController.updateSite);


module.exports = siteRouter;