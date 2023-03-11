const User = require('../models/userModel');
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

    res
        .status(201)
        .cookie('user', user, {
            httpOnly: true,
        })
        .json({
            status: 'success',
            message: 'Login Successful'
        })
});

const logout = (req, res, next) => {
    res.clearCookie('user');

    res.status(200).json({
        status: 'success',
        message: 'Logout Successful'
    })
}

const isAuthorized = (authorizationLevel) => {
    return errorCatcher((req, res, next) => {
        const { user } = req.cookies;

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
    })
}

module.exports = {
    login,
    logout,
    isAuthorized
}