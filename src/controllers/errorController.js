
const genericResponse = (res, err) => {
    return res
        .status(err.statusCode)
        .json({
            status: err.status,
            message: err.message
        })
}

const duplicateKeyError = (res, err) => {
    // Regular expression to match json object within a string.
    const duplicateObj = err.message.match(/(?<=\{)\s*[^{]*?(?=[},])/);

    return res
        .status(400)
        .json({
            status: 'fail',
            message: `Duplicate key error: it looks like ${duplicateObj} already exists.`
        })
}

const errorController = (err, req, res, next) => {
    switch(err.code) {
        case 11000:
            duplicateKeyError(res, err);
            break;
        default: 
            genericResponse(res, err)
    }
}

module.exports = errorController;