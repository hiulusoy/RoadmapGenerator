const NoteRepository = require('../repository/noteRepository');

class NoteService {

    constructor() {
        this.noteRepository = NoteRepository;
    }

    async getAll(tenantId, facilityId) {
        try {
            return await this.noteRepository.getAll(tenantId, facilityId);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getById(id, tenantId, facilityId) {
        try {
            return await this.noteRepository.getById(id, tenantId, facilityId);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async create(noteData) {
        try {
            return await this.noteRepository.create(noteData);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async update(noteData) {
        try {
            return await this.noteRepository.update(noteData);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async delete(id, tenantId, userId, facilityId) {
        try {
            return await this.noteRepository.delete(id, tenantId, userId, facilityId);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async search(filterObj, tenantId, userId, facilityId) {
        try {
            return await this.noteRepository.search(filterObj, tenantId, userId, facilityId);
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new NoteService();
