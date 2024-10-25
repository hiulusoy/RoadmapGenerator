const NodeCache = require("node-cache");
const rateLimitCache = new NodeCache({
    stdTTL: 300
}); // 600 saniye (10 dakika) boyunca önbelleğe alma.

const rateLimiter = (req, res, next) => {
    const ip = req.ip;
    const currentAttempt = rateLimitCache.get(ip) || 0;

    if (currentAttempt < 5) {
        rateLimitCache.set(ip, currentAttempt + 1);
        next();
    } else {
        res.status(429).send("Çok fazla deneme yaptınız. Lütfen bir süre sonra tekrar deneyin.");
    }
};