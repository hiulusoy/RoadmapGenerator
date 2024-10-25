const Sequelize = require('sequelize');

module.exports = {
    local: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        secret: process.env.SECRET,
        details: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: 'mysql',
            dialectOptions: {
                useUTC: false, // for reading from database
            },
            timezone: '+03:00',
            operatorsAliases: {
                $and: Sequelize.Op.and,
                $or: Sequelize.Op.or,
                $eq: Sequelize.Op.eq,
                $gt: Sequelize.Op.gt,
                $lt: Sequelize.Op.lt,
                $lte: Sequelize.Op.lte,
                $like: Sequelize.Op.like
            },
            define: {
                charset: 'utf8',
                collate: 'utf8_turkish_ci'
            },
            pool: {
                max: 5,
                min: 1,
                acquire: 30000,
                idle: 10000
            }
        }
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        secret: process.env.SECRET,
        details: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: 'mysql',
            dialectOptions: {
                useUTC: false, // for reading from database
            },
            timezone: '+03:00',
            operatorsAliases: {
                $and: Sequelize.Op.and,
                $or: Sequelize.Op.or,
                $eq: Sequelize.Op.eq,
                $gt: Sequelize.Op.gt,
                $lt: Sequelize.Op.lt,
                $lte: Sequelize.Op.lte,
                $like: Sequelize.Op.like
            },
            define: {
                charset: 'utf8',
                collate: 'utf8_turkish_ci'
            },
            pool: {
                max: 5,
                min: 1,
                acquire: 30000,
                idle: 10000
            }
        }
    }
};
