const Lookup = require('../models/lookup');
const db = require("../config/databaseSingleton");

class LookupRepository {

    findByCode = async (code) => {
        return await db.sequelize.models.Lookups.findAll({
            where: {
                code: code,
            }
        });
    }
}

module.exports = new LookupRepository();