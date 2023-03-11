
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
            message: `Duplicate Key Error: it looks like ${duplicateObj} already exists.`
        })
}

const validationError = (res, err) => {
    const errorMsg = err.message.split(': ').slice(-1);

    return res
        .status(400)
        .json({
            status: 'fail',
            message: `Validation Error: ${errorMsg}`
        })
}

const castError = (res, err) => {
    const values = err.message.split('"');

    return res
        .status(400)
        .json({
            status: 'fail',
            message: `CastError: Invalid ${values[5]} ID "${values[1]}"`
        })
}

const errorController = (err, req, res, next) => {
    if(err.code === 11000) {
        return duplicateKeyError(res, err);
    }
    else if(err.name === 'ValidationError') {
        return validationError(res, err);
    }
    else if(err.name === 'CastError') {
        return castError(res, err);
    }
    else {
        genericResponse(res, err)
    }
}

module.exports = errorController;