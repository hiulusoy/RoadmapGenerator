const RegistrationRepository = require('../repository/registrationRepository');

class RegistrationService {

    constructor() {
        this.registrationRepository = RegistrationRepository;
    }

    async getAll(tenantId, facilityId) {
        return await this.registrationRepository.getAll(tenantId, facilityId);
    }

    async getById(id, tenantId, facilityId) {
        return await this.registrationRepository.getById(id, tenantId, facilityId);
    }

    async create(registrationData) {
        return await this.registrationRepository.create(registrationData);
    }

    async update(registrationData) {
        return await this.registrationRepository.update(registrationData);
    }

    async transferRegistrationToStudents(registrationData) {
        return await this.registrationRepository.transferRegistrationToStudents(registrationData);
    }

    async delete(id, tenantId, userId, facilityId) {
        return await this.registrationRepository.delete(id, tenantId, userId, facilityId);
    }

    async search(filterObj, tenantId, userId, facilityId) {
        return await this.registrationRepository.search(filterObj, tenantId, userId, facilityId);
    }

    async searchForExcel(filterObj, tenantId, userId, facilityId) {
        return await this.registrationRepository.searchForExcel(filterObj, tenantId, userId, facilityId);
    }
}

module.exports = new RegistrationService();
