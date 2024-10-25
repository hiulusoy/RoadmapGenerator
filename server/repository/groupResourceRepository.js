const Sequelize = require('sequelize');
const {
    QueryTypes
} = require('sequelize');
const {Op} = require('sequelize');


const db = require('../config/databaseSingleton'); // db.js'in yolunu doğru şekilde belirtin

class GroupResourceRepository {

    grantResourceAccessToGroup = async (groupId, resourceId, tenantId) => {
        return db.sequelize.models.GroupResource.create({
            groupId,
            resourceId,
            tenantId
        });
    }

    revokeResourceAccessFromGroup = async (groupId, resourceId, tenantId) => {
        return db.sequelize.models.GroupResource.destroy({
            where: {
                groupId,
                resourceId,
                tenantId
            }
        });
    }

    searchGroupResource = async (filterParams, page, pageSize) => {
        const queryParams = {
            tenantId: filterParams.tenantId
        };

        let baseQuery = " SELECT\n" +
            "                gr.*, \n" +
            "                g.name AS groupName, \n" +
            "                r.name AS resourceName, \n" +
            "                r.path AS resourcePath \n" +
            "            FROM \n" +
            "                GroupResources AS gr \n" +
            "            JOIN \n" +
            "                `Groups` AS g ON g.id = gr.groupId \n" +
            "            JOIN \n" +
            "                Resources AS r ON r.id = gr.resourceId\n" +
            "            WHERE 1 = 1 \n" +
            "            AND gr.tenantId = " + queryParams.tenantId;

        if (filterParams.groupId) {
            baseQuery += ' AND gr.groupId = :groupId';
            queryParams.groupId = filterParams.groupId;
        }

        if (filterParams.resourceId) {
            baseQuery += ' AND gr.resourceId = :resourceId';
            queryParams.resourceId = filterParams.resourceId;
        }

        // Pagination
        baseQuery += ' ORDER BY gr.groupId DESC, gr.resourceId DESC LIMIT :offset, :limit';
        queryParams.offset = Math.max(0, (page - 1) * pageSize);
        queryParams.limit = pageSize;

        const countQuery = `
            SELECT COUNT(*) as totalCount
            FROM GroupResources AS gr
            WHERE 1 = 1
              AND gr.tenantId = :tenantId
        `;

        const dataResults = await db.sequelize.query(baseQuery, {
            replacements: queryParams,
            type: Sequelize.QueryTypes.SELECT
        });

        const countResults = await db.sequelize.query(countQuery, {
            replacements: queryParams,
            type: Sequelize.QueryTypes.SELECT
        });

        const totalCount = countResults[0].totalCount;

        // Audit log kaydını oluştur
        await db.sequelize.models.Audit.create({
            module: 'group-resource',
            function: 'search',
            context: dataResults,
            userId: filterParams.userId,
            tenantId: filterParams.tenantId
        });

        return {
            groupResources: dataResults,
            totalCount: totalCount
        };
    };
// TODO: FIX GROUP ID
    getByGroupId = async (groupId) => {
        const baseQuery = `
            SELECT r.id                             AS resourceId,
                   r.name                           AS resourceName,
                   r.method                         AS method,
                   r.path                           AS path,
                   r.description                    AS resourceDescription,
                   IF(gr.groupId IS NOT NULL, 1, 0) AS isLinkedToGroup
            FROM \`Resources\` r
                     LEFT JOIN \`GroupResources\` gr ON r.id = gr.resourceId AND gr.groupId = :groupId
            WHERE 1 = 1
              AND (path IS NOT NULL AND path != '')
              AND (method IS NOT NULL AND method != '')
            ORDER BY isLinkedToGroup DESC, r.name ASC
        `;

        const queryParams = {groupId: groupId};

        const resourceResults = await db.sequelize.query(baseQuery, {
            replacements: queryParams,
            type: Sequelize.QueryTypes.SELECT
        });

        console.log(resourceResults, 'resourceResults');

        return {groupResources: resourceResults, totalCount: resourceResults.length};
    }


    update = async (groupId, updateData) => {
        const transaction = await db.sequelize.transaction();

        try {
            // Birden fazla kaynağı çıkarma işlemi
            if (updateData.remove && updateData.remove.length > 0) {
                await db.sequelize.models.GroupResource.destroy({
                    where: {
                        groupId: groupId,
                        resourceId: {
                            [Op.in]: updateData.remove  // Sequelize'in Op.in operatörünü kullanarak
                        }
                    },
                    transaction: transaction
                });
            }

            // Birden fazla kaynağı ekleme işlemi
            if (updateData.add && updateData.add.length > 0) {
                // bulkCreate kullanarak tüm yeni kaynakları toplu olarak ekle
                const newResources = updateData.add.map(resourceId => {
                    return {groupId: groupId, resourceId: resourceId};
                });

                await db.sequelize.models.GroupResource.bulkCreate(newResources, {transaction: transaction});
            }

            // Eğer her şey yolunda giderse transaction'ı tamamla (commit)
            await transaction.commit();
            return {added: updateData.add, removed: updateData.remove};
        } catch (error) {
            console.log(error, 'error')
            // Eğer bir hata meydana gelirse yapılan değişiklikleri geri al (rollback)
            await transaction.rollback();
            throw new Error(`Error updating group resources: ${error.message}`);
        }
    }


}

module.exports = new GroupResourceRepository();