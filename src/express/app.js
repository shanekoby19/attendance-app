// Import libraries
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

// Import routers
const siteRouter = require('../routes/siteRouter.js')
const keyRouter = require('../routes/keyRouter.js');


// Create our app.
const app = express();

// Add the cors middleware
app.use(cors({
    origin: 'http://localhost:3001'
}))

// Add the body parser middleware to parse incoming post requests and include the json onto the req.body object.
app.use(express.json());

// Add the express.static middleware to serve static files from the public directory.
app.use(express.static(path.join(`${__dirname}`, '../../public')));

// Add the morgan logging middleware to our middleware stack. - Uses the dev flag to help see route information and only runs in development
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


// Router middleware
app.use('/api/v1/sites', siteRouter);
app.use('/api/v1/keys', keyRouter);

module.exports = app;