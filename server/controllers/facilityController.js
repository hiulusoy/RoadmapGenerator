const FacilityService = require('../service/facilityService');

const { sendResponse, sendErrorResponse } = require('../utils/controllerUtil');

class FacilityController {
  constructor() {
    this.facilityService = FacilityService;
  }

  getAll = async (req, res) => {
    try {
      const facilities = await this.facilityService.getAll(req.tenantId);
      return sendResponse(res, facilities);
    } catch (error) {
      return sendErrorResponse(res, error.message, error.statusCode);
    }
  };

  searchFacility = async (req, res) => {
    const { page, pageSize, ...filterParams } = req.body;

    filterParams.userId = req.userId;
    filterParams.tenantId = req.tenantId;

    try {
      const result = await this.facilityService.search(filterParams, page, pageSize);
      return sendResponse(res, result.facilities, result.totalCount);
    } catch (error) {
      return sendErrorResponse(res, error.message, error.statusCode);
    }
  };

  getById = async (req, res) => {
    try {
      const facility = await this.facilityService.getById(req.params.id, req.tenantId);
      if (!facility) {
        return sendErrorResponse(res, 'Facility not found', 404);
      }
      return sendResponse(res, facility);
    } catch (error) {
      return sendErrorResponse(res, error.message, error.statusCode);
    }
  };

  createFacility = async (req, res) => {
    try {
      const facilityData = {
        ...req.body,
        tenantId: req.tenantId,
      };
      const result = await this.facilityService.createFacility(facilityData);
      return sendResponse(res, result);
    } catch (error) {
      return sendErrorResponse(res, error.message, error.statusCode);
    }
  };

  updateFacility = async (req, res) => {
    try {
      const facilityData = {
        ...req.body,
        tenantId: req.tenantId,
      };
      const result = await this.facilityService.updateFacility(req.params.id, facilityData);
      return sendResponse(res, result);
    } catch (error) {
      return sendErrorResponse(res, error.message, error.statusCode);
    }
  };

  deleteFacility = async (req, res) => {
    try {
      const result = await this.facilityService.deleteFacility(req.params.id, req.tenantId);
      return sendResponse(res, result);
    } catch (error) {
      return sendErrorResponse(res, error.message, error.statusCode);
    }
  };
}

module.exports = new FacilityController();
