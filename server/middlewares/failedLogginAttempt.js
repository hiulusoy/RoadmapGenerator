const NodeCache = require('node-cache');

const loginAttemptCache = new NodeCache({
    stdTTL: 3600
}); // 1 saatlik süre için önbelleğe alma.
const db = require('../config/databaseSingleton'); // db.js'in yolunu doğru şekilde belirtin
const SUPERADMIN_EMAIL = process.env.SUPERADMIN_EMAIL;
const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_HASHED_PASSWORD;


const clearFailedLoginCache = (userEmail) => {
    loginAttemptCache.del(userEmail);
}

const failedLoginAttempt = async (req, res, next) => {
    const userEmail = req.body.email;

    // Eğer SUPERADMIN ise bu middleware'i atla
    // if (userEmail === SUPERADMIN_EMAIL && bcrypt.compareSync(req.body.password, SUPERADMIN_PASSWORD)) {
    //     return next();
    // }

    const currentAttempt = loginAttemptCache.get(userEmail) || 0;

    if (currentAttempt >= 3) {
        await db.sequelize.models.User.update({
            isLocked: true
        }, {
            where: {
                email: userEmail
            }
        });

        // res.status(403).send("Hesabınız geçici olarak kilitlenmiştir. Lütfen daha sonra tekrar deneyin veya şifrenizi sıfırlayın.");
        return;
    }

    loginAttemptCache.set(userEmail, currentAttempt + 1);
    next();
};

module.exports = {
    failedLoginAttempt,
    clearFailedLoginCache // Fonksiyonu dışarıya aktardık
};
