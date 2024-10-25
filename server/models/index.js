const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'production';
const config = require(path.join(__dirname, '/../config/config.js'))[env];
const db = {};
const dbInstance = require('../config/databaseSingleton'); // <-- İmport edilen singleton instance
let sequelize;

const files = fs
  .readdirSync(__dirname)
  .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js' && file !== 'index.js');

files.forEach((file) => {
  const model = require(path.join(__dirname, file))(dbInstance.sequelize, Sequelize); // <-- Burada singleton sequelize instance'ını kullan
  db[model.name] = model;
});

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = dbInstance.sequelize; // <-- Burada singleton sequelize instance'ını atadık
db.Sequelize = Sequelize;

module.exports = db;
