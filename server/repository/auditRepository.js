const Audit = require('../models/Audit');

class AuditRepository {
    getAll(tenantId) {
        return Audit.find({
            tenantId
        });
    }

    getById(id, tenantId) {
        return Audit.findOne({
            _id: id,
            tenantId
        });
    }
}

module.exports = new AuditRepository();