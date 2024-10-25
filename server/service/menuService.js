const MenuRepository = require('../repository/menuRepository');

class MenuService {
    constructor() {
        this.menuRepository = MenuRepository;
    }

    // groupService.js

    createMenu = async (groupData, tenantId, facilityId) => {
        try {
            return await this.menuRepository.createMenu(groupData, tenantId, facilityId);
        } catch (error) {
            throw new Error(`Error while creating group: ${error.message}`);
        }
    }

    searchMenu = async (filterParams, page, pageSize) => {
        try {
            return await this.menuRepository.searchMenu(filterParams, page, pageSize);
        } catch (error) {
            throw new Error(`Error while searching menus: ${error.message}`);
        }
    }

    getMenuDetails = async (groupId, tenantId) => {
        try {
            return await this.menuRepository.getMenuById(groupId, tenantId);
        } catch (error) {
            throw new Error(`Error while fetching group details: ${error.message}`);
        }
    }

    updateMenu = async (groupId, groupData, tenantId, facilityId) => {
        try {
            return await this.menuRepository.updateMenu(groupId, groupData, tenantId, facilityId);
        } catch (error) {
            throw new Error(`Error while updating group: ${error.message}`);
        }
    }

    deleteMenu = async (groupId, tenantId) => {
        try {
            return await this.menuRepository.deleteMenu(groupId, tenantId);
        } catch (error) {
            throw new Error(`Error while deleting group: ${error.message}`);
        }
    }


}

module.exports = new MenuService();