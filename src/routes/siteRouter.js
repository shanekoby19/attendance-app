const express = require('express');
const siteController = require('../controllers/siteController');

const siteRouter = express.Router();

// Add middleware that checks on the id to ensure it's valid before continuing.
siteRouter.param('id', siteController.checkId);

const isValidSite = (req, res, next) => {
    // If any data is missing for the new site, send an error.
    if(!req.body.program || !req.body.site || !req.body.latitude || !req.body.longitude) {
        return res.status(400).json({
            status: 'failed',
            data: {
                message: 'You must include all required fields in order to create a new site.'
            }
        })
    }

    next();
}

siteRouter
    .route('/')
    .get(siteController.getAllSites)
    .post(isValidSite, siteController.createSite)
    
siteRouter
    .route('/:id')
    .get(siteController.getSiteById)
    .patch(siteController.updateSite);


module.exports = siteRouter;