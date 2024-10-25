const MenuService = require('../../service/menuService');

const {
    sendResponse,
    sendErrorResponse
} = require('../../utils/controllerUtil');


class MenuController {

    constructor() {
        this.menuService = MenuService;

    }

    create = async (req, res) => {
        try {
            const menus = await this.menuService.createMenu(req.body, req.tenantId, req.facilityId);
            return sendResponse(res, menus);
        } catch (error) {
            return sendErrorResponse(res, error.message, error.statusCode);
        }
    }

    search = async (req, res) => {
        const {
            page,
            pageSize,
            ...filterParams
        } = req.body;

        filterParams.userId = req.userId;

        try {
            const result = await this.menuService.searchMenu(filterParams, page, pageSize);
            return sendResponse(res, result.menus, result.totalCount);
        } catch (error) {
            return sendErrorResponse(res, error.message, error.statusCode);
        }
    }

    getMenuDetails = async (req, res) => {
        try {
            const menus = await this.menuService.getMenuDetails(req.params.id, req.tenantId, req.facilityId);
            return sendResponse(res, menus);
        } catch (error) {
            return sendErrorResponse(res, error.message, error.statusCode);
        }
    }

    update = async (req, res) => {
        try {
            const updatedMenu = await this.menuService.updateMenu(req.params.id, req.body, req.tenantId, req.facilityId);
            return sendResponse(res, updatedMenu);
        } catch (error) {
            return sendErrorResponse(res, error.message, error.statusCode);
        }
    }

    delete = async (req, res) => {
        try {
            await this.menuService.deleteMenu(req.params.id, req.tenantId, req.facilityId);
            return sendResponse(res, {
                message: "Menu deleted successfully"
            });
        } catch (error) {
            return sendErrorResponse(res, error.message, error.statusCode);
        }
    }

}

module.exports = new MenuController();