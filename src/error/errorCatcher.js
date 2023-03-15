const errorCatcher = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch(err) {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            if(!err.status) {
                err.status = 'fail';
            }
            next(err);
        }
    }
}

module.exports = errorCatcher;