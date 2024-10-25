const Sequelize = require('sequelize');
const {
    QueryTypes
} = require('sequelize');

const db = require('../config/databaseSingleton'); // db.js'in yolunu doğru şekilde belirtin

class MenuRepository {

    createMenu = async (menuData, tenantId, facilityId) => {
        return await db.sequelize.models.Menu.create({
            ...menuData,
            tenantId: tenantId,
            facilityId: facilityId
        });
    }

    searchMenu = async (filterParams, page, pageSize) => {
        const queryParams = {
            tenantId: filterParams.tenantId
        };

        let baseQuery = `
            SELECT m.*
            FROM Menus m
            WHERE 1 = 1`;

        // Pagination
        baseQuery += ' LIMIT :offset, :limit';
        queryParams.offset = Math.max(0, (page - 1) * pageSize);
        queryParams.limit = pageSize;

        const countQuery = `
            SELECT COUNT(DISTINCT m.id) as totalCount
            FROM Menus m
            WHERE 1 = 1`;

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
            module: 'menu',
            function: 'search',
            context: dataResults,
            userId: filterParams.userId,
            tenantId: filterParams.tenantId
        });

        return {
            menus: dataResults,
            totalCount: totalCount
        };
    }

    getMenuById = async (menuId, tenantId, facilityId) => {
        return db.sequelize.models.Menu.findOne({
            where: {
                id: menuId,
                tenantId: tenantId,
                facilityId: facilityId
            }
        });
    }

    updateMenu = async (menuId, menuData, tenantId, facilityId) => {
        return db.sequelize.models.Menu.update(menuData, {
            where: {
                id: menuId,
                tenantId: tenantId,
                facilityId: facilityId
            }
        });
    }

    deleteMenu = async (menuId, tenantId, facilityId) => {
        return await db.sequelize.models.Menu.destroy({
            where: {
                id: menuId,
                tenantId: tenantId,
                facilityId: facilityId
            }
        });
    }


}

module.exports = new MenuRepository();