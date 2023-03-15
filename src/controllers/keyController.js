const Key = require('../models/keyModel');
const errorCatcher = require('../error/errorCatcher');
const AttendanceError = require('../error/AttendanceError');

const getAllKeys = errorCatcher(async (req, res, next) => {
    const query =  req.query?.name ? {
        name: req.query.name
    } : {};
    
    const keys = await Key.find(query);

    if(keys.length === 0) {
        return next(new AttendanceError(`The key you are looking for doesn't exist`, 400, 'fail'))
    }
    
    res.status(200).json({
        status: 'success',
        data: {
            keys
        }
    })
});

const addKey = errorCatcher(async (req, res, next) => {
    const keyToInsert = {
        name: req.body.name,
        key: req.body.key
    };

    
    const newKey = await Key.create(keyToInsert);
        

    res.status(201).json({
        status: 'success',
        data: {
            key: newKey
        }
    })
});

module.exports =  {
    getAllKeys,
    addKey
}