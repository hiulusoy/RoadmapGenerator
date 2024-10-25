const GroupRepository = require('../repository/groupRepository');

class GroupService {
    constructor() {
        this.groupRepository = GroupRepository;
    }


    createGroup = async (groupData, tenantId, facilityId) => {
        try {
            return await this.groupRepository.createGroup(groupData, tenantId, facilityId);
        } catch (error) {
            throw new Error(`Error while creating group: ${error.message}`);
        }
    }

    searchGroup = async (filterObj, tenantId, userId, facilityId) => {
        try {
            return await this.groupRepository.searchGroup(filterObj, tenantId, userId, facilityId);
        } catch (error) {
            throw new Error(`Error while searching groups: ${error.message}`);
        }
    }

    getGroupDetails = async (groupId, tenantId) => {
        try {
            return await this.groupRepository.getGroupById(groupId, tenantId);
        } catch (error) {
            throw new Error(`Error while fetching group details: ${error.message}`);
        }
    }

    updateGroup = async (groupId, groupData, tenantId, facilityId) => {
        try {
            return await this.groupRepository.updateGroup(groupId, groupData, tenantId, facilityId);
        } catch (error) {
            throw new Error(`Error while updating group: ${error.message}`);
        }
    }

    deleteGroup = async (groupId, tenantId, facilityId) => {
        try {
            return await this.groupRepository.deleteGroup(groupId, tenantId, facilityId);
        } catch (error) {
            throw new Error(`Error while deleting group: ${error.message}`);
        }
    }


}

module.exports = new GroupService();
