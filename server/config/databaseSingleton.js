const Sequelize = require('sequelize');
const path = require('path');
const configPath = path.join(__dirname, '/../config/config.js');
const env = process.env.NODE_ENV || 'production';
const config = require(configPath)[env];

class DatabaseSingleton {
    constructor() {
        if (!DatabaseSingleton.instance) {
            if (config.dbUrl) {
                this.sequelize = new Sequelize(process.env[config.dbUrl], config.details);
            } else {
                this.sequelize = new Sequelize(config.database, config.username, config.password, config.details);
            }
            DatabaseSingleton.instance = this;
        }

        return DatabaseSingleton.instance;
    }
}

const instance = new DatabaseSingleton();
Object.freeze(instance);

module.exports = instance;
