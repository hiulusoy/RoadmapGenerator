const db = require('../config/databaseSingleton');

module.exports = {
// Resource kaydını yapan fonksiyon
    async registerResource(method, path, description) {
        // Veritabanında aynı path ve method ile kayıt olup olmadığını kontrol et
        const existingResource = await db.sequelize.models.Resource.findOne({where: {path, method}});

        if (!existingResource) {
            // Yoksa yeni kaydı oluştur
            await db.sequelize.models.Resource.create({method: method, name: description, description, path});
        }
    }
}