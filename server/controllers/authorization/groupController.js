const GroupService = require('../../service/groupService');

const {
    sendResponse,
    sendErrorResponse
} = require('../../utils/controllerUtil');


class GroupController {

    constructor() {
        this.groupService = GroupService;

    }

    // groupController.js

    create = async (req, res) => {
        try {
            const group = await this.groupService.createGroup(req.body, req.tenantId, req.facilityId);
            return sendResponse(res, group);
        } catch (error) {
            return sendErrorResponse(res, error.message, error.statusCode);
        }
    }

    search = async (req, res) => {
        const tenantId = req.tenantId;
        const userId = req.userId;
        const facilityId = req.facilityId;
        const filterObj = req.body;

        try {
            const result = await this.groupService.searchGroup(filterObj, tenantId, userId, facilityId);
            return sendResponse(res, result.groups, result.totalCount);
        } catch (error) {
            return sendErrorResponse(res, error.message, error.statusCode);
        }
    };

    getGroupDetails = async (req, res) => {
        try {
            const group = await this.groupService.getGroupDetails(req.params.id, req.tenantId, req.facilityId);
            return sendResponse(res, group);
        } catch (error) {
            return sendErrorResponse(res, error.message, error.statusCode);
        }
    }

    update = async (req, res) => {
        try {
            const updatedGroup = await this.groupService.updateGroup(req.params.id, req.body, req.tenantId, req.facilityId);
            return sendResponse(res, updatedGroup);
        } catch (error) {
            return sendErrorResponse(res, error.message, error.statusCode);
        }
    }

    delete = async (req, res) => {
        try {
            await this.groupService.deleteGroup(req.params.id, req.tenantId, req.facilityId);
            return sendResponse(res, {
                message: "Group deleted successfully"
            });
        } catch (error) {
            return sendErrorResponse(res, error.message, error.statusCode);
        }
    }

}

module.exports = new GroupController();
