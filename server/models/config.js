module.exports = function(sequelize, DataTypes) {
  let Config = sequelize.define('Config', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    fieldName: {
      type: DataTypes.STRING,
    },
    fieldValue: {
      type: DataTypes.STRING
    }
  });

  return Config;
};
