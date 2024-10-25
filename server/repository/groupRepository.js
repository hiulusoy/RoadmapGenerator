const Sequelize = require('sequelize');
const {
    QueryTypes
} = require('sequelize');

const db = require('../config/databaseSingleton'); // db.js'in yolunu doğru şekilde belirtin

class GroupRepository {

    // groupRepository.js

    createGroup = async (groupData, tenantId, facilityId) => {
        return await db.sequelize.models.Group.create({
            ...groupData,
            tenantId: tenantId,
            facilityId: facilityId
        });
    }

    searchGroup = async (filterObj, tenantId, userId, facilityId) => {
        const searchable = filterObj?.searchable || {};
        const page = filterObj?.page;
        const limit = filterObj?.limit;
        const queryParams = {tenantId, facilityId};

        let baseQuery = `
            SELECT g.id,
                   g.name,
                   g.description,
                   g.tenantId,
                   g.facilityId
            FROM \`Groups\` g
            WHERE 1 = 1
              AND g.tenantId = :tenantId
              AND g.facilityId = :facilityId
        `;

        let countQuery = `
            SELECT COUNT(DISTINCT g.id) as totalCount
            FROM \`Groups\` g
            WHERE 1 = 1
              AND g.tenantId = :tenantId
              AND g.facilityId = :facilityId
        `;

        // Filter conditions
        if (searchable.groupName) {
            baseQuery += ' AND g.name LIKE :groupName';
            countQuery += ' AND g.name LIKE :groupName';
            queryParams.groupName = `%${searchable.groupName}%`;
        }

        if (searchable.groupDescription) {
            baseQuery += ' AND g.description LIKE :groupDescription';
            countQuery += ' AND g.description LIKE :groupDescription';
            queryParams.groupDescription = `%${searchable.groupDescription}%`;
        }

        // Pagination
        baseQuery += ' ORDER BY g.name ASC';  // Optional sorting
        if (limit !== undefined && page !== undefined) {
            baseQuery += ' LIMIT :limit OFFSET :offset';
            queryParams.limit = limit;
            queryParams.offset = page * limit;
        }

        try {
            // Fetch data
            const dataResults = await db.sequelize.query(baseQuery, {
                replacements: queryParams,
                type: QueryTypes.SELECT
            });

            // Fetch count
            const countResults = await db.sequelize.query(countQuery, {
                replacements: queryParams,
                type: QueryTypes.SELECT
            });

            const totalCount = countResults[0].totalCount;

            // Audit log
            await db.sequelize.models.Audit.create({
                module: 'group',
                function: 'search',
                context: searchable,
                userId: userId,
                tenantId: tenantId
            });

            return {
                groups: dataResults,
                totalCount: totalCount
            };
        } catch (error) {
            console.error(error);
            throw new Error(`Error while searching groups: ${error.message}`);
        }
    };

    //TODO: ALTTAKI 2 METOD AYNI ISLEVDE
    getGroupById = async (groupId, tenantId, facilityId) => {
        return db.sequelize.models.Group.findOne({
            where: {
                id: groupId,
                tenantId: tenantId,
                facilityId: facilityId,
                active: 1
            }
        });
    }

    async findById(groupId) {
        const query = `
            SELECT *
            FROM \`Groups\`
            WHERE id = :groupId
            LIMIT 1
        `;
        const result = await db.sequelize.query(query, {
            type: QueryTypes.SELECT,
            replacements: {groupId}
        });

        return result.length ? result[0] : null;
    }

    updateGroup = async (groupId, groupData, tenantId, facilityId) => {
        return db.sequelize.models.Group.update(groupData, {
            where: {
                id: groupId,
                tenantId: tenantId,
                facilityId: facilityId,
                active: 1
            }
        });
    }

    deleteGroup = async (groupId, tenantId, facilityId) => {
        return await db.sequelize.models.Group.destroy({
            where: {
                id: groupId,
                tenantId: tenantId,
                facilityId: facilityId,
                active: 1
            }
        });
    }


}

module.exports = new GroupRepository();
