module.exports = function (req, res, next) {
    if (process.env.APP_SSL === 'true') {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            const redirectUrl = ['https://', req.get('Host'), req.url].join('');
            console.log(`Redirecting to: ${redirectUrl}`);
            res.redirect(redirectUrl);
        } else {
            next();
        }
    } else {
        next();
    }
};
  