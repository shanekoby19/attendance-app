const Key = require('../models/keyModel');

const getAllKeys = async (req, res) => {
    const query =  req.query?.name ? {
        name: req.query.name
    } : {}

    const keys = await Key.find(query);

    if(keys.length === 0) {
        return res.status(400).json({
            status: 'fail',
            message: `The key you are looking for doesn't exist`
        })
    }
    
    res.status(200).json({
        status: 'success',
        data: {
            keys
        }
    })
}

const addKey = async (req, res) => {
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
}

module.exports =  {
    getAllKeys,
    addKey
}