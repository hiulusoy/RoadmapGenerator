const ParentsRepository = require('../repository/parentsRepository');

class ParentService {
    constructor() {
        this.parentsRepository = ParentsRepository;
    }

    async getParentByStudentId(id, tenantId, facilityId) {
        try {
            return await this.parentsRepository.getParentByParentsId(id, tenantId, facilityId);
        } catch (error) {
            throw new Error(`Error fetching all parents: ${error.message}`);
        }
    }
}

module.exports = new ParentService();


