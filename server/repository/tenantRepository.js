const db = require('../config/databaseSingleton');
const {QueryTypes} = require('sequelize');

class TenantRepository {
    getAll = async () => {
        const query = `
            SELECT *
            FROM Tenants
            WHERE isActive = true
        `;
        return await db.sequelize.query(query, {
            type: QueryTypes.SELECT
        });
    }

    getById = async (id) => {
        const query = `
            SELECT *
            FROM Tenants
            WHERE id = :id
              AND isActive = true
        `;
        return await db.sequelize.query(query, {
            type: QueryTypes.SELECT,
            replacements: {id}
        });
    }

    create = async (tenantData) => {
        return await db.sequelize.models.Tenants.create(tenantData);
    }

    update = async (id, tenantData) => {
        return await db.sequelize.models.Tenants.update(tenantData, {
            where: {
                id: id,
                isActive: true
            }
        });
    }

    delete = async (id) => {
        return await db.sequelize.models.Tenants.update(
            {isActive: false},
            {
                where: {
                    id: id
                }
            }
        );
    }
}

module.exports = new TenantRepository();
