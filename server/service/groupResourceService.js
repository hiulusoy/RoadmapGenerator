const GroupResourceRepository = require('../repository/groupResourceRepository');

class GroupResourceService {
    constructor() {
        this.groupResourceRepository = GroupResourceRepository;
    }

    searchGroupResource = async (filterParams, page, pageSize) => {
        try {
            return await this.groupResourceRepository.searchGroupResource(filterParams, page, pageSize);
        } catch (error) {
            throw new Error(`Error while searching groupResources: ${error.message}`);
        }
    }

    getByGroupId = async (groupId, tenantId, facilityId) => {
        try {
            return await this.groupResourceRepository.getByGroupId(groupId, tenantId, facilityId);
        } catch (err) {
            throw new Error(`Hata: ${err.message}`);
        }
    }


    updateGroupResource = async (id, updateData) => {
        try {
            return await this.groupResourceRepository.update(id, updateData);
        } catch (err) {
            throw new Error(`UserGroupService Error: ${err.message}`);
        }
    };

    grantResourceAccessToGroup = async (groupId, resourceData, tenantId) => {
        try {
            return await this.groupResourceRepository.grantResourceAccessToGroup(groupId, resourceData, tenantId);
        } catch (error) {
            throw new Error(`Error while granting resource access to group: ${error.message}`);
        }
    }


    revokeResourceAccessFromGroup = async (groupId, resourceId, tenantId) => {
        try {
            return await this.groupResourceRepository.revokeResourceAccessFromGroup(groupId, resourceId, tenantId);
        } catch (error) {
            throw new Error(`Error while revoking resource access from group: ${error.message}`);
        }
    }


}

module.exports = new GroupResourceService();