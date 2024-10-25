// middlewares/oauthMiddleware.js

const axios = require('axios');

const checkOAuthToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split('Bearer ')[1];

    if (!token) {
        return res.status(403).send({
            message: 'No OAuth token provided!',
        });
    }

    try {
        // OAuth token'ını Facebook API üzerinden doğrulayabilirsiniz
        const response = await axios.get(`https://graph.facebook.com/debug_token`, {
            params: {
                input_token: token,
                access_token: `${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`,
            },
        });

        if (!response.data.data.is_valid) {
            return res.status(401).send({
                message: 'Invalid OAuth token!',
            });
        }

        req.oauthToken = token;

        next();
    } catch (err) {
        console.error('OAuth Middleware Error:', err);
        return res.status(500).send({
            message: err.message || 'Internal Server Error',
        });
    }
};

module.exports = {
    checkOAuthToken,
};
