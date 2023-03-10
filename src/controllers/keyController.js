import { Key } from '../models/keyModel';

export const getAllKeys = async (req, res) => {
    const keys = await Key.find();
    
    res.status(200).json({
        status: 'success',
        data: {
            keys
        }
    })
}

export const getKeyByName = async (req, res) => {
    const { name } = req.query;

    const key = await Key.find({ name: name });
    
    res.status(200).json({
        status: 'success',
        data: {
            key
        }
    })
}

export const addKey = async (req, res) => {
    const keyToInsert = {
        name: req.body.name,
        key: req.body.key
    };

    const newKey = await Key.insertOne(keyToInsert);

    res.status(201).json({
        status: 'success',
        data: {
            newKey
        }
    })
}