const GroupResourceService = require('../../service/groupResourceService');

const {
    sendResponse,
    sendErrorResponse
} = require('../../utils/controllerUtil');


class GroupResourceController {

    constructor() {
        this.groupResourceService = GroupResourceService;

    }

    // groupResourceController.js

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
            const result = await this.groupResourceService.searchGroupResource(filterParams, page, pageSize);
            return sendResponse(res, result.groupResources, result.totalCount);
        } catch (error) {
            return sendErrorResponse(res, error.message, error.statusCode);
        }
    }

    getByGroupId = async (req, res) => {
        const groupId = req.params.groupId;
        const tenantId = req.tenantId;
        const facilityId = req.facilityId;


        try {
            const result = await this.groupResourceService.getByGroupId(groupId, tenantId, facilityId);
            return sendResponse(res, result.groupResources, result.totalCount);
        } catch (error) {
            return sendErrorResponse(res, error.message, error.statusCode);
        }
    };

    updateGroupResource = async (req, res) => {
        try {
            const groupId = req.params.groupId; // URL'den alınan kullanıcı ID'si
            const resourceChanges = req.body; // Güncellenmek istenen resource'lar üyelikleri
            const updatedGroupResources = await this.groupResourceService.updateGroupResource(groupId, resourceChanges);
            return sendResponse(res, updatedGroupResources, 'Group Resources updated successfully');
        } catch (error) {
            return sendErrorResponse(res, error.message);
        }
    };

    grantResourceAccessToGroup = async (req, res) => {
        try {
            await this.groupResourceService.grantResourceAccessToGroup(req.params.groupId, req.body, req.tenantId, req.facilityId);
            return sendResponse(res, {
                message: "Resource access granted to group successfully"
            });
        } catch (error) {
            return sendErrorResponse(res, error.message, error.statusCode);
        }
    }

    revokeResourceAccessFromGroup = async (req, res) => {
        try {
            await this.groupResourceService.revokeResourceAccessFromGroup(req.params.groupId, req.params.resourceId, req.tenantId, req.facilityId);
            return sendResponse(res, {
                message: "Resource access revoked from group successfully"
            });
        } catch (error) {
            return sendErrorResponse(res, error.message, error.statusCode);
        }
    }


}

module.exports = new GroupResourceController();