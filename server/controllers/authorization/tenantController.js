const TenantService = require('../../service/tenantService');
const {sendResponse, sendErrorResponse} = require('../../utils/controllerUtil');

class TenantController {
    constructor() {
        this.tenantService = TenantService;
    }

    getAll = async (req, res) => {
        try {
            const tenants = await this.tenantService.getAll();
            return sendResponse(res, tenants);
        } catch (error) {
            return sendErrorResponse(res, error.message, error.statusCode);
        }
    }

    getById = async (req, res) => {
        try {
            const tenant = await this.tenantService.getById(req.params.id);
            return sendResponse(res, tenant);
        } catch (error) {
            return sendErrorResponse(res, error.message, error.statusCode);
        }
    }

    createTenant = async (req, res) => {
        try {
            const tenantData = req.body;
            const result = await this.tenantService.createTenant(tenantData);
            return sendResponse(res, result);
        } catch (error) {
            return sendErrorResponse(res, error.message, error.statusCode);
        }
    }

    updateTenant = async (req, res) => {
        try {
            const tenantData = req.body;
            const result = await this.tenantService.updateTenant(req.params.id, tenantData);
            return sendResponse(res, result);
        } catch (error) {
            return sendErrorResponse(res, error.message, error.statusCode);
        }
    }

    deleteTenant = async (req, res) => {
        try {
            const result = await this.tenantService.deleteTenant(req.params.id);
            return sendResponse(res, result);
        } catch (error) {
            return sendErrorResponse(res, error.message, error.statusCode);
        }
    }
}

module.exports = new TenantController();
