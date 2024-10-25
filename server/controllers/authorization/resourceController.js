const ResourceService = require('../../service/resourceService');

const {
    sendResponse,
    sendErrorResponse
} = require('../../utils/controllerUtil');

class ResourceController {
    constructor() {
        this.resourceService = ResourceService;
    }

    getById = async (req, res) => {
        const filterParams = {
            tenantId: req.tenantId,
            facilityId: req.facilityId,
            resourceId: req.params.id
        };

        try {
            const courseBranch = await this.resourceService.getById(filterParams);
            return sendResponse(res, courseBranch);
        } catch (err) {
            return sendErrorResponse(res, err.message);
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
            const result = await this.resourceService.searchResource(filterParams, page, pageSize);
            return sendResponse(res, result.resources, result.totalCount);
        } catch (error) {
            return sendErrorResponse(res, error.message, error.statusCode);
        }
    }


    //
    // update = async (req, res) => {
    //     try {
    //         const resourceId = req.params.id;
    //         const resourceData = req.body;
    //         const updatedResource = await this.resourceService.updateResource(resourceId, resourceData);
    //         return sendResponse(res, updatedResource);
    //     } catch (error) {
    //         return sendErrorResponse(res, error.message, error.statusCode);
    //     }
    // };
    //
    // delete = async (req, res) => {
    //     try {
    //         const resourceId = req.params.id;
    //         await this.resourceService.deleteResource(resourceId);
    //         return sendResponse(res, {message: "Resource deleted successfully"});
    //     } catch (error) {
    //         return sendErrorResponse(res, error.message, error.statusCode);
    //     }
    // };
    //
    // // Aşağıda eklenen yeni metodlar
    //

    //
    // addResourceToGroup = async (req, res) => {
    //     try {
    //         const {resourceId, groupId} = req.body;
    //         const result = await this.resourceService.addResourceToGroup(resourceId, groupId);
    //         return sendResponse(res, result, 'Resource added to group successfully');
    //     } catch (error) {
    //         return sendErrorResponse(res, error.message);
    //     }
    // };
    //
    // removeResourceFromGroup = async (req, res) => {
    //     try {
    //         const {resourceId, groupId} = req.body;
    //         await this.resourceService.removeResourceFromGroup(resourceId, groupId);
    //         return sendResponse(res, null, 'Resource removed from group successfully');
    //     } catch (error) {
    //         return sendErrorResponse(res, error.message);
    //     }
    // };
}

module.exports = new ResourceController();