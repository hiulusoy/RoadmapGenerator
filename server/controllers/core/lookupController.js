const _ = require('underscore');

const LookupService = require('../../service/lookupService');

const {
    sendResponse,
    sendErrorResponse
} = require('../../utils/controllerUtil');

class LookupController {
    constructor() {
        this.lookupService = LookupService;
    }

    getLookups = async (req, res) => {
        try {
            const code = req.query.code;
            const result = await this.lookupService.getLookups(code);
            return sendResponse(res, result);
        } catch (err) {
            return sendErrorResponse(res, err.message);
        }
    };
}

module.exports = new LookupController();
