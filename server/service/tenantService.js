const TenantRepository = require('../repository/tenantRepository');

class TenantService {
    constructor() {
        this.tenantRepository = TenantRepository;
    }

    getAll = async () => {
        try {
            return await this.tenantRepository.getAll();
        } catch (err) {
            throw new Error(`Error: ${err.message}`);
        }
    }

    getById = async (id) => {
        try {
            return await this.tenantRepository.getById(id);
        } catch (err) {
            throw new Error(`Error: ${err.message}`);
        }
    }

    createTenant = async (tenantData) => {
        try {
            return await this.tenantRepository.create(tenantData);
        } catch (err) {
            throw new Error(`Error: ${err.message}`);
        }
    }

    updateTenant = async (id, tenantData) => {
        try {
            return await this.tenantRepository.update(id, tenantData);
        } catch (err) {
            throw new Error(`Error: ${err.message}`);
        }
    }

    deleteTenant = async (id) => {
        try {
            return await this.tenantRepository.delete(id);
        } catch (err) {
            throw new Error(`Error: ${err.message}`);
        }
    }
}

module.exports = new TenantService();
