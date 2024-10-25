const db = require('../config/databaseSingleton'); // Adjust the path according to your structure
const {QueryTypes} = require('sequelize');

class FacilityRepository {
    getAll = async (tenantId) => {
        const query = `
            SELECT *
            FROM Facilities
            WHERE tenantId = :tenantId
              AND isActive = true
        `;
        return await db.sequelize.query(query, {
            type: QueryTypes.SELECT,
            replacements: {tenantId}
        });
    }

    async search(filterParams, page, pageSize) {
        const queryParams = {
            tenantId: filterParams.tenantId
        };

        let baseQuery = `
            SELECT f.*
            FROM Facilities f
            WHERE 1 = 1
              AND f.tenantId = :tenantId`;

        if (filterParams.searchable.name) {
            baseQuery += ' AND f.name LIKE :name';
            queryParams.name = `%${filterParams.searchable.name}%`;
        }

        if (filterParams.searchable.city) {
            baseQuery += ' AND f.city LIKE :city';
            queryParams.city = `%${filterParams.searchable.city}%`;
        }

        if (filterParams.searchable.country) {
            baseQuery += ' AND f.country LIKE :country';
            queryParams.country = `%${filterParams.searchable.country}%`;
        }

        if (filterParams.searchable.isActive !== undefined) {
            baseQuery += ' AND f.isActive = :isActive';
            queryParams.isActive = filterParams.searchable.isActive;
        }

        baseQuery += ' GROUP BY f.id';

        // Pagination
        baseQuery += ' ORDER BY f.createdAt DESC LIMIT :offset, :limit';
        queryParams.offset = Math.max(0, (page - 1) * pageSize);
        queryParams.limit = pageSize;

        const countQuery = `
            SELECT COUNT(DISTINCT f.id) as totalCount
            FROM Facilities f
            WHERE 1 = 1
              AND f.tenantId = :tenantId`;

        const dataResults = await db.sequelize.query(baseQuery, {
            replacements: queryParams,
            type: QueryTypes.SELECT
        });

        const countResults = await db.sequelize.query(countQuery, {
            replacements: queryParams,
            type: QueryTypes.SELECT
        });

        const totalCount = countResults[0].totalCount;

        return {
            facilities: dataResults,
            totalCount: totalCount
        };
    }

    getById = async (id, tenantId) => {
        const query = `
            SELECT *
            FROM Facilities
            WHERE id = :id
              AND tenantId = :tenantId
              AND isActive = true
            LIMIT 1
        `;
        const result = await db.sequelize.query(query, {
            type: QueryTypes.SELECT,
            replacements: { id, tenantId }
        });
        return result.length > 0 ? result[0] : null;
    }

    create = async (facilityData) => {
        return await db.sequelize.models.Facilities.create(facilityData);
    }

    update = async (id, facilityData) => {
        return await db.sequelize.models.Facilities.update(facilityData, {
            where: {
                id: id,
                tenantId: facilityData.tenantId,
                isActive: true
            }
        });
    }

    delete = async (id, tenantId) => {
        return await db.sequelize.models.Facilities.update(
            {isActive: false},
            {
                where: {
                    id: id,
                    tenantId: tenantId
                }
            }
        );
    }
}

module.exports = new FacilityRepository();
