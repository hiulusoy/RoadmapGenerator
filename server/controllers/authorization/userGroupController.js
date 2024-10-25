const UserGroupService = require('../../service/userGroupService');

const {
    sendResponse,
    sendErrorResponse
} = require('../../utils/controllerUtil');

class UserGroupController {
    constructor() {
        this.userGroupService = UserGroupService;
    }

    getAllUserGroups = async (req, res) => {
        try {
            const result = await this.userGroupService.getAllUserGroups();
            return sendResponse(res, result);
        } catch (err) {
            return sendErrorResponse(res, err.message);
        }
    };

    getUserGroupById = async (req, res) => {
        try {
            const id = req.params.id;
            const result = await this.userGroupService.getUserGroupById(id);
            return sendResponse(res, result);
        } catch (error) {
            return sendErrorResponse(res, error.message);
        }
    };

    getUserGroupsByUserId = async (req, res) => {
        try {
            const userId = req.params.userId;
            const result = await this.userGroupService.getUserGroupsByUserId(userId);
            return sendResponse(res, result);
        } catch (error) {
            return sendErrorResponse(res, error.message);
        }
    };

    createUserGroup = async (req, res) => {
        try {
            const userGroupData = req.body; // Burada gerekli alanların olup olmadığını kontrol etmek önemli olabilir
            const newUserGroup = await this.userGroupService.createUserGroup(userGroupData);
            return sendResponse(res, newUserGroup, 'User group created successfully');
        } catch (error) {
            return sendErrorResponse(res, error.message);
        }
    };

    updateUserGroup = async (req, res) => {
        try {
            const userId = req.params.id; // URL'den alınan kullanıcı ID'si
            const groupChanges = req.body; // Güncellenmek istenen grup üyelikleri
            const updatedUserGroups = await this.userGroupService.updateUserGroup(userId, groupChanges);
            return sendResponse(res, updatedUserGroups, 'User group updated successfully');
        } catch (error) {
            return sendErrorResponse(res, error.message);
        }
    };

    deleteUserGroup = async (req, res) => {
        try {
            const id = req.params.id; // URL'den alınan grup ID'si
            await this.userGroupService.deleteUserGroup(id);
            return sendResponse(res, null, 'User group deleted successfully');
        } catch (error) {
            return sendErrorResponse(res, error.message);
        }
    };


    addUserToGroup = async (req, res) => {
        try {
            const {userId, groupId} = req.body;
            const result = await this.userGroupService.addUserToGroup(userId, groupId);
            return sendResponse(res, result, 'User added to group successfully');
        } catch (error) {
            return sendErrorResponse(res, error.message);
        }
    };

    removeUserFromGroup = async (req, res) => {
        try {
            const {userId, groupId} = req.body;
            await this.userGroupService.removeUserFromGroup(userId, groupId);
            return sendResponse(res, null, 'User removed from group successfully');
        } catch (error) {
            return sendErrorResponse(res, error.message);
        }
    };

    search = async (req, res) => {
        const {
            page,
            pageSize,
            ...filterParams
        } = req.body;

        filterParams.userId = req.userId;
        filterParams.tenantId = req.tenantId;
        filterParams.facilityId = req.facilityId;

        try {
            const result = await this.userGroupService.searchUserGroup(filterParams, page, pageSize);
            return sendResponse(res, result.userGroups, result.totalCount);
        } catch (error) {
            return sendErrorResponse(res, error.message, error.statusCode);
        }
    };

    getByUserId = async (req, res) => {
        const userId = req.params.userId;
        const tenantId = req.tenantId;

        try {
            const result = await this.userGroupService.getByUserId(userId, tenantId);
            return sendResponse(res, result.userGroups, result.totalCount);
        } catch (error) {
            return sendErrorResponse(res, error.message, error.statusCode);
        }
    };

}

module.exports = new UserGroupController();
