const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const errorCatcher = require('../error/errorCatcher');
const AttendanceError = require('../error/AttendanceError')

const login = errorCatcher(async (req, res, next) => {
    const userQuery = {
        email: req.body.email,
        password: req.body.password
    }

    const user = await User.findOne(userQuery);

    if(!user) {
        return next(new AttendanceError('We could not find a user with the given email and password', 400, 'fail'))
    }

    const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
        expiresIn: "3h"
    });

    res
        .status(201)
        .cookie('token', token, {
            httpOnly: true,
        })
        .json({
            status: 'success',
            user: user,
            message: 'Login Successful'
        })
});

const logout = (req, res, next) => {
    res.clearCookie('token');

    req.body = {};

    res.status(200).json({
        status: 'success',
        message: 'Logout Successful'
    })
}

const isAuthorized = (authorizationLevel) => {
    return (req, res, next) => {
        const { user } = req;

        // User has recently logged out or cookie has expired for other reason.
        if(!user) {
            return next(new AttendanceError(`Sorry, it looks like you aren't logged in. Please login again to view this resource.`, 400, 'fail'))
        }

        const authorizationMap = {
            'viewer': 0,
            'admin': 1,
            'super admin': 2,
        }
        const authorizationScore = authorizationMap[authorizationLevel]
        const userRoleScore = authorizationMap[user.role];

        if(userRoleScore < authorizationScore) {
            return res.status(401).json({
                status: 'fail',
                message: `This actions requies a user role of ${authorizationLevel} but you only have the role ${user.role}`
            })
        }

        next();
    }
}

const isAuthenticated = errorCatcher(async (req, res, next) => {
    const { token } = req.cookies;

    // If the token doesn't exist send an error.
    if(!token) {
        return next(new AttendanceError('Sorry, no token was provided. Please login to gain access to this data.', 401, 'fail'))
    }

    const decodedUser = jwt.verify(token, process.env.JWT_SECRET, {
        maxAge: "3h"
    });

    const user = await User.findById(decodedUser._id);

    // If the decodedUser object does not have the same id as the user in the database, reject the attempt to login.
    if(decodedUser._id !== user._id.toString()) {
        return next(new AttendanceError('Invalid user, your token has been tampered with. Please logout and login again to be reverified.', 401, 'fail'))
    }

    req.user = user;

    next();
});

const getAuthUser = (req, res, next) => {
    res.status(200).json({
        data: req.user,
    })
};

module.exports = {
    login,
    logout,
    isAuthorized,
    isAuthenticated,
    getAuthUser,
}