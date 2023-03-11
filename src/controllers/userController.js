const User = require('../models/userModel');
const errorCatcher = require('../error/errorCatcher');

const getUsers = errorCatcher(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        status: 'success',
        data: {
            users
        }
    })
})

const addUser = errorCatcher(async (req, res, next) => {
    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
    }

    const newUser = await User.create(user);

    res.status(201).json({
        status: 'success',
        data: {
            user: newUser
        }
    })
});

module.exports = {
    getUsers,
    addUser
}