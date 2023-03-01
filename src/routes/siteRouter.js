const express = require('express');
const siteController = require('../controllers/siteController');

const siteRouter = express.Router();

siteRouter
    .route('/')
    .get(siteController.getSites)
    .post(siteController.getCoordinates, siteController.createSite)
    
siteRouter
    .route('/:id')
    .get(siteController.getSiteById)
    .patch(siteController.updateSite)
    .delete(siteController.deleteSite);

module.exports = siteRouter;