const User = require('../models/userModel');

const getUsers = async (req, res) => {
    const users = await User.find();

    res.status(200).json({
        status: 'success',
        data: {
            users
        }
    })
}

const addUser = async (req, res) => {
    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
    }

    const newUser = await User.create({ user });

    res.status(201).json({
        status: 'success',
        data: {
            user: newUser
        }
    })
}

module.exports = {
    getUsers,
    addUser
}