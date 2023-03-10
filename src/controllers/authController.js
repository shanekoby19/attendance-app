const User = require('../models/userModel');

const login = async (req, res, next) => {
    const userQuery = {
        email: req.body.email,
        password: req.body.password
    }

    const user = await User.findOne(userQuery);

    if(!user) {
        return res
            .status(401).json({
                status: 'fail',
                message: 'This action requires authentication. We could not find your credentials in the database. Please try again.'
            })
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
}

const logout = (req, res, next) => {
    res.clearCookie('user');

    res.status(200).json({
        status: 'success',
        message: 'Logout Successful'
    })
}

const isAuthorized = (authorizationLevel) => {

    return (req, res, next) => {
        const { user } = req.cookies;

        // User has recently logged out or cookie has expired for other reason.
        if(!user) {
            return res.status(401).json({
                status: 'fail',
                message: `Sorry, it looks like you aren't logged in. Please login again to view this resource.`
            })
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

module.exports = {
    login,
    logout,
    isAuthorized
}