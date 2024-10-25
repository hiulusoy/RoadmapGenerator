module.exports = function (req, res, next) {
    let err = new Error('Not Found: ' + req.url);
    err['status'] = 404;
    next(err);
};
