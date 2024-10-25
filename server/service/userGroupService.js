const UserGroupRepository = require('../repository/userGroupRepository');

class UserGroupService {
    constructor() {
        this.userGroupRepository = UserGroupRepository;
    }

    getAllUserGroups = async () => {
        try {
            return await this.userGroupRepository.getAll();
        } catch (err) {
            throw new Error(`UserGroupService Error: ${err.message}`);
        }
    };

    getUserGroupById = async (id) => {
        try {
            return await this.userGroupRepository.getById(id);
        } catch (err) {
            throw new Error(`UserGroupService Error: ${err.message}`);
        }
    };

    getUserGroupsByUserId = async (userId) => {
        try {
            return await this.userGroupRepository.getByUserId(userId);
        } catch (err) {
            throw new Error(`UserGroupService Error: ${err.message}`);
        }
    };

    addUserToGroup = async (userId, groupId) => {
        try {
            return await this.userGroupRepository.addUserToGroup(userId, groupId);
        } catch (err) {
            throw new Error(`UserGroupService Error: ${err.message}`);
        }
    };

    removeUserFromGroup = async (userId, groupId) => {
        try {
            return await this.userGroupRepository.removeUserFromGroup(userId, groupId);
        } catch (err) {
            throw new Error(`UserGroupService Error: ${err.message}`);
        }
    };

    getByUserId = async (userId, tenantId) => {
        try {
            const result = await this.userGroupRepository.getByUserId(userId, tenantId);
            return result;
        } catch (err) {
            throw new Error(`Hata: ${err.message}`);
        }
    };


    searchUserGroup = async (filterParams, page = 0, pageSize = 10) => {
        try {
            return await this.userGroupRepository.search(filterParams, page, pageSize);
        } catch (err) {
            throw new Error(`Hata: ${err.message}`);
        }
    }


    createUserGroup = async (userGroupData) => {
        try {
            return await this.userGroupRepository.create(userGroupData);
        } catch (err) {
            throw new Error(`UserGroupService Error: ${err.message}`);
        }
    };

    updateUserGroup = async (id, updateData) => {
        try {
            return await this.userGroupRepository.update(id, updateData);
        } catch (err) {
            throw new Error(`UserGroupService Error: ${err.message}`);
        }
    };

    deleteUserGroup = async (id) => {
        try {
            return await this.userGroupRepository.delete(id);
        } catch (err) {
            throw new Error(`UserGroupService Error: ${err.message}`);
        }
    };
}

module.exports = new UserGroupService();
