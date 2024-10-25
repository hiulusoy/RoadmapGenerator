const Sequelize = require('sequelize');
const {QueryTypes} = require('sequelize');
const db = require('../config/databaseSingleton');

class UserGroupsRepository {

    getByUserId = async (userId, tenantId) => {
        const query = `
            SELECT g.id AS groupId, g.name AS groupName
            FROM \`Groups\` g
                     JOIN \`UserGroups\` ug ON g.id = ug.groupId
            WHERE ug.userId = :userId
        `;

        const countQuery = `
            SELECT COUNT(*) AS totalCount
            FROM \`UserGroups\`
            WHERE userId = :userId
        `;

        const dataResults = await db.sequelize.query(query, {
            replacements: {userId},
            type: QueryTypes.SELECT
        });

        const countResult = await db.sequelize.query(countQuery, {
            replacements: {userId},
            type: QueryTypes.SELECT
        });

        return {
            userGroups: dataResults,
            totalCount: countResult[0].totalCount
        };
    };

    async create(userGroupEntry, transaction) {
        try {
            return await db.sequelize.models.UserGroups.create(userGroupEntry, {transaction});
        } catch (error) {
            console.error('Error creating user group entry:', error);
            throw new Error('Error creating user group entry: ' + error.message);
        }
    }


    getAll = async () => {
        const query = `
            SELECT ug.*, u.username, g.name AS groupName, t.name AS tenantName, f.name AS facilityName
            FROM UserGroups ug
                     LEFT JOIN Users u ON ug.userId = u.id
                     LEFT JOIN \`Groups\` g ON ug.groupId = g.id
                     LEFT JOIN Tenants t ON ug.tenantId = t.id
                     LEFT JOIN Facilities f ON ug.facilityId = f.id
        `;

        try {
            const userGroups = await db.sequelize.query(query, {
                type: QueryTypes.SELECT
            });
            return userGroups;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    getById = async (id) => {
        try {
            const userGroup = await db.sequelize.models.UserGroups.findByPk(id);
            return userGroup;
        } catch (err) {
            throw new Error(err.message);
        }
    }


    search = async (filterParams, page, pageSize) => {
        const queryParams = {
            tenantId: filterParams.tenantId,
            facilityId: filterParams.facilityId,
        };

        let baseQuery = `
            SELECT u.id       AS userId,
                   u.userName AS username,
                   t.name     AS tenant,
                   CASE
                       WHEN ug.groupId IS NULL THEN 'NoGroup'
                       ELSE GROUP_CONCAT(g.name SEPARATOR ', ')
                       END    AS groupNames,
                   ug.entityId
            FROM \`Users\` u
                     LEFT JOIN
                 \`UserGroups\` ug ON u.id = ug.userId
                     LEFT JOIN
                 \`Groups\` g ON ug.groupId = g.id
                     JOIN
                 \`Tenants\` t ON t.id = u.tenantId
            WHERE t.id = :tenantId
              AND ug.facilityId = :facilityId
            GROUP BY u.id, u.userName, t.name, ug.entityId
        `;

        // Pagination
        baseQuery += ' LIMIT :offset, :limit';
        queryParams.offset = Math.max(0, (page - 1) * pageSize);
        queryParams.limit = pageSize;

        const countQuery = `
            SELECT COUNT(DISTINCT ug.id) as totalCount
            FROM \`UserGroups\` ug
            WHERE ug.tenantId = :tenantId
              AND ug.facilityId = :facilityId
        `;

        const dataResults = await db.sequelize.query(baseQuery, {
            replacements: queryParams,
            type: QueryTypes.SELECT
        });

        const countResults = await db.sequelize.query(countQuery, {
            replacements: queryParams,
            type: QueryTypes.SELECT
        });

        const totalCount = countResults[0].totalCount;

        // Audit log kaydını oluştur
        await db.sequelize.models.Audit.create({
            module: 'userGroup',
            function: 'search',
            context: filterParams,
            userId: filterParams.userId,
            tenantId: filterParams.tenantId
        });

        return {
            userGroups: dataResults,
            totalCount: totalCount
        };
    }


    update = async (userId, groupChanges) => {
        // Yalnızca tek bir değişiklik olmalı ve bu değişiklik isMember=true olmalı.
        if (groupChanges.length !== 1 || !groupChanges[0].isMember) {
            throw new Error('User must be assigned to exactly one group.');
        }

        const transaction = await db.sequelize.transaction();

        try {
            const groupId = groupChanges[0].groupId;

            // Mevcut grupları al
            const existingGroups = await db.sequelize.models.UserGroups.findAll({
                where: {userId: userId},
                transaction: transaction
            });

            // Kullanıcı zaten bu gruptaysa veya hiçbir gruba üye değilse işlem yap
            const isAlreadyMember = existingGroups.some(group => group.groupId === groupId);
            if (isAlreadyMember) {
                // Kullanıcı zaten bu grupta, hiçbir şey yapma
                await transaction.commit();
                return {message: 'No changes made to user group.'};
            } else {
                // Kullanıcıyı önceki tüm gruplardan çıkar
                if (existingGroups.length > 0) {
                    await db.sequelize.models.UserGroups.destroy({
                        where: {userId: userId},
                        transaction: transaction
                    });
                }

                // Kullanıcıyı yeni gruba ekle
                await this.addUserToGroup(userId, groupId, transaction);

                await transaction.commit();
                return {message: 'User group updated successfully'};
            }
        } catch (error) {
            console.log(error, 'error')
            await transaction.rollback();
            throw error;
        }
    };

    addUserToGroup = async (userId, groupId, transaction) => {
        console.log(`Adding user ${userId} to group ${groupId}`);
        return db.sequelize.models.UserGroups.create({
            userId,
            groupId
        }, {transaction}).catch(err => {
            console.error('Error in addUserToGroup:', err);
            throw err;
        });
    };

    removeUserFromGroup = async (userId, groupId, transaction) => {
        return db.sequelize.models.UserGroups.destroy({
            where: {
                userId: userId,
                groupId: groupId
            },
            transaction
        });
    };

    delete = async (id) => {
        try {
            await db.sequelize.models.UserGroups.destroy({
                where: {id: id}
            });
        } catch (err) {
            throw new Error(err.message);
        }
    }
}

module.exports = new UserGroupsRepository();
