const AuditRepository = require('../repository/auditRepository');

class AuditService {
    async getAll(tenantId) {
        const audits = await AuditRepository.getAll(tenantId);
        // burada audits üzerinde istediğiniz işlemleri gerçekleştirebilirsiniz
        return audits;
    }

    async getById(id, tenantId) {
        const audit = await AuditRepository.getById(id, tenantId);
        // burada audit üzerinde istediğiniz işlemleri gerçekleştirebilirsiniz
        return audit;
    }
}

module.exports = new AuditService();