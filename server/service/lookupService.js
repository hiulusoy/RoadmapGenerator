const LookupRepository = require("../repository/lookupRepository");

class LookupService {

    constructor() {
        this.lookupRepository = LookupRepository;
    }

    getLookups = async (code) => {
        try {
            return await this.lookupRepository.findByCode(code);
        } catch (err) {
            throw new Error(`Hata: ${err.message}`);
        }
    }
}

module.exports = new LookupService();