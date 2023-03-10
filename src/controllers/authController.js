const User = require('../models/userModel');

const login = async (req, res, next) => {
    const userQuery = {
        email: req.body.loginEmail,
        password: req.body.loginPassword
    }

    const user = await User.findOne(userQuery);

    if(!user) {
        return res
            .status(401).json({
                status: 'fail',
                message: 'This action requires authentication. We could not find your credentials in the database. Please try again.'
            })
    }

    req.user = user;
    next();
}

const isAuthorized = (authorizationLevel) => {

    return (req, res, next) => {

        const authorizationMap = {
            'viewer': 0,
            'admin': 1,
            'super admin': 2,
        }
        const authorizationScore = authorizationMap[authorizationLevel]
        const userRoleScore = authorizationMap[req.user.role];

        if(userRoleScore < authorizationScore) {
            return res.status(401).json({
                status: 'fail',
                message: `This actions requies a user role of ${authorizationLevel} but you only have the role ${req.user.role}`
            })
        }

        req.isAuthorized = true;
        next();
    }
}

module.exports = {
    login,
    isAuthorized
}