const User = require('../models/user');
const {
    QueryTypes,
} = require('sequelize');

const db = require('../config/databaseSingleton');
const firebaseSuperAdmin = require("../config/firebase-admin"); // db.js'in yolunu doğru şekilde belirtin

class UserRepository {

    getById = async (id, tenantId, facilityId) => {
        return db.sequelize.models.User.findOne({
            where: {
                id: id,
                tenantId: tenantId,
                active: 1
            }
        });
    }

    findUserByEmail = async (email) => {
        return db.sequelize.models.User.findOne({where: {email}});
    }

    create = async (user, transaction) => {
        try {
            return await db.sequelize.models.User.create(user, {transaction});
        } catch (error) {
            console.error('Error creating user:', error);
            throw new Error('Error creating user: ' + error.message);
        }
    }

    searchByUserId = async (targetUserId, tenantId, facilityId, loggedUserId) => {
        const queryParams = {targetUserId, tenantId, facilityId, loggedUserId};

        let baseQuery = `
            SELECT u.id,
                   u.firstName,
                   u.lastName,
                   u.userName,
                   u.email,
                   u.createdAt,
                   u.updatedAt,
                   u.tenantId,
                   u.active,
                   u.isLocked,
                   g.description    AS groupDescription,
                   g.id    AS groupId,
                   t.name    AS tenantName,     -- Tenant bilgisi
                   f.name    AS facilityName,   -- Facility bilgisi
                   f.address AS facilityAddress -- Facility adresi
            FROM Users u
                     LEFT JOIN UserGroups ug ON u.id = ug.userId
                     LEFT JOIN \`Groups\` g ON g.id = ug.groupId
                     LEFT JOIN Tenants t ON u.tenantId = t.id
                     LEFT JOIN Facilities f ON f.id = :facilityId AND f.tenantId = u.tenantId
            WHERE u.id = :targetUserId
              AND u.tenantId = :tenantId
              AND u.active = 1;
        `;

        try {
            // Fetch data
            const userResult = await db.sequelize.query(baseQuery, {
                replacements: queryParams,
                type: QueryTypes.SELECT,
            });

            if (userResult.length === 0) {
                throw new Error('User not found');
            }

            // Audit Log
            await db.sequelize.models.Audit.create({
                module: 'users',
                function: 'findByUserId',
                context: {'userFound': targetUserId},
                userId: loggedUserId,
                tenantId,
            });

            return userResult[0]; // Tek kullanıcıyı döndürüyoruz
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    searchUser = async (filterObj, tenantId, userId, facilityId) => {
        const searchable = filterObj?.searchable || {};
        const page = filterObj?.page;
        const limit = filterObj?.limit;
        const queryParams = {tenantId, facilityId};

        let baseQuery = `
            SELECT u.id,
                   u.firstName,
                   u.lastName,
                   u.userName,
                   u.email,
                   u.createdAt,
                   u.updatedAt,
                   u.tenantId,
                   u.active,
                   u.isLocked,
                   g.name    as groupName,
                   t.name    as tenantName,     -- Fetching tenant name
                   f.name    as facilityName,   -- Fetching facility name
                   f.address as facilityAddress -- Fetching facility address
            FROM Users u
                     LEFT JOIN UserGroups ug ON u.id = ug.userId
                     LEFT JOIN \`Groups\` g ON g.id = ug.groupId
                     LEFT JOIN Tenants t ON u.tenantId = t.id -- Joining Tenants
                     LEFT JOIN Facilities f ON f.id = :facilityId AND f.tenantId = u.tenantId -- Joining Facilities
            WHERE 1 = 1
              AND u.tenantId = :tenantId
              AND u.active = 1
        `;

        let countQuery = `
            SELECT COUNT(DISTINCT u.id) as totalCount
            FROM Users u
                     LEFT JOIN UserGroups ug ON u.id = ug.userId
                     LEFT JOIN \`Groups\` g ON g.id = ug.groupId
                     LEFT JOIN Tenants t ON u.tenantId = t.id
                     LEFT JOIN Facilities f ON f.id = :facilityId AND f.tenantId = u.tenantId
            WHERE 1 = 1
              AND u.tenantId = :tenantId
              AND u.active = 1
        `;

        // Filter conditions
        if (searchable.userName) {
            baseQuery += ' AND u.userName LIKE :userName';
            countQuery += ' AND u.userName LIKE :userName';
            queryParams.userName = `%${searchable.userName}%`;
        }

        if (searchable.email) {
            baseQuery += ' AND u.email LIKE :email';
            countQuery += ' AND u.email LIKE :email';
            queryParams.email = `%${searchable.email}%`;
        }

        if (searchable.firstName) {
            baseQuery += ' AND u.firstName LIKE :firstName';
            countQuery += ' AND u.firstName LIKE :firstName';
            queryParams.firstName = `%${searchable.firstName}%`;
        }

        if (searchable.lastName) {
            baseQuery += ' AND u.lastName LIKE :lastName';
            countQuery += ' AND u.lastName LIKE :lastName';
            queryParams.lastName = `%${searchable.lastName}%`;
        }

        // Group ID filter
        if (searchable.groupId) {
            baseQuery += ' AND g.id = :groupId';
            countQuery += ' AND g.id = :groupId';
            queryParams.groupId = searchable.groupId;
        }

        if (searchable.active !== undefined) {
            baseQuery += ' AND u.active = :active';
            countQuery += ' AND u.active = :active';
            queryParams.active = searchable.active;
        }

        // Pagination
        baseQuery += `
        GROUP BY u.id, u.firstName, u.lastName, u.userName, u.email, u.createdAt, u.updatedAt, u.tenantId, u.active, u.isLocked, g.name, t.name, f.name, f.address
        ORDER BY u.userName ASC
    `;

        if (limit !== undefined && page !== undefined) {
            baseQuery += ' LIMIT :limit OFFSET :offset';
            queryParams.limit = limit;
            queryParams.offset = page * limit;
        }

        try {
            // Fetch data
            const dataResults = await db.sequelize.query(baseQuery, {
                replacements: queryParams,
                type: QueryTypes.SELECT,
            });

            // Fetch count
            const countResults = await db.sequelize.query(countQuery, {
                replacements: {tenantId, facilityId},
                type: QueryTypes.SELECT,
            });

            const totalCount = countResults[0].totalCount;

            // Audit
            await db.sequelize.models.Audit.create({
                module: 'users',
                function: 'search',
                context: searchable,
                userId: userId,
                tenantId: tenantId,
            });

            return {
                users: dataResults,
                totalCount,
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    updateUser = async (userId, tenantId, updateData, facilityId) => {
        return db.sequelize.models.User.updateOne(updateData, {
            where: {id: userId, tenantId: tenantId}
        });
    }

    updateBasicUserInformation = async (userId, firstName, lastName) => {
        const user = await db.sequelize.models.User.findByPk(userId);

        if (!user) {
            throw new Error('User not found.');
        }

        user.firstName = firstName;
        user.lastName = lastName;

        await user.save();

        return user;
    }


    deactivateUser = async (id, tenantId, userId, facilityId) => {
        const updateInfo = {
            active: 0, // 'active' alanı üzerinden pasif yapıyoruz
            updatedAt: new Date(),
        };

        const result = await db.sequelize.models.User.update(updateInfo, {
            where: {id: id, tenantId: tenantId},
        });

        if (result == 0) {
            throw new Error(`Unable to find or update user with ID ${id}.`);
        }

        // Audit kaydı
        await db.sequelize.models.Audit.create({
            module: 'users',
            function: 'deactivateUser',
            context: JSON.stringify({userId, tenantId, facilityId, action: 'deactivate', targetUserId: id}),
            userId: userId, // işlemi yapan kullanıcı
            tenantId: tenantId,
            facilityId: facilityId,
            createdAt: new Date(),
        });

        return result;
    };


    lockUserAccount = async (id, tenantId, userId, facilityId) => {
        const updateInfo = {
            isLocked: 1, // 'isLocked' alanı üzerinden kilitleme yapıyoruz
            updatedAt: new Date(),
        };

        const result = await db.sequelize.models.User.update(updateInfo, {
            where: {id: id, tenantId: tenantId},
        });

        if (result == 0) {
            throw new Error(`Unable to find or update user with ID ${id}.`);
        }

        // Audit kaydı
        await db.sequelize.models.Audit.create({
            module: 'users',
            function: 'lockUserAccount',
            context: JSON.stringify({userId, tenantId, facilityId, action: 'lock', targetUserId: id}),
            userId: userId, // işlemi yapan kullanıcı
            tenantId: tenantId,
            facilityId: facilityId,
            createdAt: new Date(),
        });

        return result;
    };


    unlockUserAccount = async (id, tenantId, userId, facilityId) => {
        const updateInfo = {
            isLocked: 0, // 'isLocked' alanı üzerinden kilidi açıyoruz
            updatedAt: new Date(),
        };

        const result = await db.sequelize.models.User.update(updateInfo, {
            where: {id: id, tenantId: tenantId},
        });

        if (result == 0) {
            throw new Error(`Unable to find or update user with ID ${id}.`);
        }

        // Audit kaydı
        await db.sequelize.models.Audit.create({
            module: 'users',
            function: 'unlockUserAccount',
            context: JSON.stringify({userId, tenantId, facilityId, action: 'unlock', targetUserId: id}),
            userId: userId, // işlemi yapan kullanıcı
            tenantId: tenantId,
            facilityId: facilityId,
            createdAt: new Date(),
        });

        return result;
    };


    findEntitiesWithoutUsers = async (request) => {
        let query;
        const queryParams = {
            tenantId: request.tenantId,
            facilityId: request.facilityId,
            email: request.email // Email'i sorgu parametresi olarak ekliyoruz
        };

        switch (request.entityType) {
            case 'TRAINER':
                query = `
                    SELECT t.id, t.trainerName as 'name', t.email as 'email'
                    FROM Trainers t
                             LEFT JOIN UserGroups ug
                                       ON ug.entityId = t.id AND ug.tenantId = :tenantId AND ug.facilityId = :facilityId
                    WHERE ug.entityId IS NULL
                      AND t.active = 1
                      AND t.facilityId = :facilityId
                      AND t.tenantId = :tenantId
                      AND t.email = :email -- Email ile kontrol
                    ORDER BY t.trainerName ASC
                `;
                break;
            case 'PARENT':
                query = `
                    SELECT pt.id, pt.name as 'name', pt.email as 'email'
                    FROM Parents pt
                             LEFT JOIN UserGroups ug
                                       ON ug.entityId = pt.id AND ug.tenantId = :tenantId AND ug.facilityId = :facilityId
                    WHERE ug.entityId IS NULL
                      AND pt.active = 1
                      AND pt.facilityId = :facilityId
                      AND pt.tenantId = :tenantId
                      AND pt.email = :email -- Email ile kontrol
                    ORDER BY pt.name ASC
                `;
                break;
            default:
                throw new Error('Invalid entity type');
        }

        const dataResults = await db.sequelize.query(query, {
            replacements: queryParams,
            type: QueryTypes.SELECT
        });

        if (dataResults.length === 0) {
            let errorMessage = 'Kayıt bulunamadı';
            if (request.entityType === 'TRAINER') {
                errorMessage = 'Bu email adresine sahip bir hoca bulunamadı';
            } else if (request.entityType === 'PARENT') {
                errorMessage = 'Bu email adresine sahip bir veli bulunamadı';
            }
            throw new Error(errorMessage);
        }

        return {users: dataResults};
    };


    migrateUserToFirebase = async (userId, password) => {
        try {
            const userId = req.body.userId;
            const password = req.body.password;

            // Belirtilen userId'ye sahip kullanıcıyı yerel veritabanından al
            const user = await db.sequelize.models.User.findByPk(userId);

            if (!user) {
                throw new Error(`Kullanıcı bulunamadı: ID ${userId}`);
            }

            // Kullanıcıyı Firebase Authentication'da oluştur
            const firebaseUser = await firebaseSuperAdmin.auth().createUser({
                email: user.email,
                password: password,
                displayName: `${user.firstName} ${user.lastName}`
            });

            // Kullanıcının Firebase UID'sini yerel veritabanında güncelle
            await user.update({firebaseId: firebaseUser.uid});

            console.log(`Kullanıcı ${user.email} Firebase'e başarıyla taşındı.`);
            return true;
        } catch (error) {
            console.error(`Kullanıcı taşınamadı:`, error);
            throw new Error(`User with ID ${id} can not be created.`);
        }
    }

    updateFirebaseId = async (userId, tenantId, firebaseId, facilityId, transaction = null) => {
        const updateData = {firebaseId: firebaseId};
        const options = {
            where: {
                id: userId,
                tenantId: tenantId
            }
        };

        // Eğer bir transaction varsa, onu options'a ekleyelim
        if (transaction) {
            options.transaction = transaction;
        }

        // Kullanıcıyı firebaseId ile güncelle
        return db.sequelize.models.User.update(updateData, options);
    };


    createAudit = async (auditData, transaction) => {
        try {
            return await db.sequelize.models.Audit.create(auditData, {transaction});
        } catch (error) {
            console.error('Error creating audit:', error);
            throw new Error('Error creating audit: ' + error.message);
        }
    }

}

module.exports = new UserRepository();
