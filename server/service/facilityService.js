const FacilityRepository = require('../repository/facilityRepository');

class FacilityService {
    constructor() {
        this.facilityRepository = FacilityRepository;
    }

    getAll = async (tenantId) => {
        try {
            return await this.facilityRepository.getAll(tenantId);
        } catch (err) {
            throw new Error(`Error: ${err.message}`);
        }
    }

    async search(filterParams, page = 0, pageSize = 10) {
        try {
            return await this.facilityRepository.search(filterParams, page, pageSize);
        } catch (err) {
            throw new Error(`Hata: ${err.message}`);
        }
    }

    getById = async (id, tenantId) => {
        try {
            return await this.facilityRepository.getById(id, tenantId);
        } catch (err) {
            throw new Error(`Error: ${err.message}`);
        }
    }

    createFacility = async (facilityData) => {
        try {
            return await this.facilityRepository.create(facilityData);
        } catch (err) {
            throw new Error(`Error: ${err.message}`);
        }
    }

    updateFacility = async (id, facilityData) => {
        try {
            return await this.facilityRepository.update(id, facilityData);
        } catch (err) {
            throw new Error(`Error: ${err.message}`);
        }
    }

    deleteFacility = async (id, tenantId) => {
        try {
            return await this.facilityRepository.delete(id, tenantId);
        } catch (err) {
            throw new Error(`Error: ${err.message}`);
        }
    }
}

module.exports = new FacilityService();