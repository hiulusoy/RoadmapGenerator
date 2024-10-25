const ResourceRepository = require('../repository/resourceRepository');

class ResourceService {
    constructor() {
        this.resourceRepository = ResourceRepository;
    }

    // resourceService.js

    createResource = async (resourceData) => {
        try {
            return await this.resourceRepository.createResource(resourceData);
        } catch (error) {
            throw new Error(`Error while creating resource: ${error.message}`);
        }
    };

    searchResource = async (filterParams, page = 0, pageSize = 10) => {
        try {
            return await this.resourceRepository.searchResource(filterParams, page, pageSize);
        } catch (error) {
            throw new Error(`Error while searching resources: ${error.message}`);
        }
    };

    getById = async (filterParams) => {
        try {
            return this.resourceRepository.getById(filterParams);
        } catch (err) {
            throw new Error(`Error while fetching resource: ${error.message}`);
        }
    };

    updateResource = async (resourceId, resourceData) => {
        try {
            return await this.resourceRepository.updateResource(resourceId, resourceData);
        } catch (error) {
            throw new Error(`Error while updating resource: ${error.message}`);
        }
    };

    deleteResource = async (resourceId) => {
        try {
            return await this.resourceRepository.deleteResource(resourceId);
        } catch (error) {
            throw new Error(`Error while deleting resource: ${error.message}`);
        }
    };

    getResourcesByGroupId = async (groupId) => {
        try {
            return await this.resourceRepository.getResourcesByGroupId(groupId);
        } catch (error) {
            throw new Error(`Error while getting resources by group ID: ${error.message}`);
        }
    };

    addResourceToGroup = async (resourceId, groupId) => {
        try {
            return await this.resourceRepository.addResourceToGroup(resourceId, groupId);
        } catch (error) {
            throw new Error(`Error while adding resource to group: ${error.message}`);
        }
    };

    removeResourceFromGroup = async (resourceId, groupId) => {
        try {
            return await this.resourceRepository.removeResourceFromGroup(resourceId, groupId);
        } catch (error) {
            throw new Error(`Error while removing resource from group: ${error.message}`);
        }
    };

}

module.exports = new ResourceService();