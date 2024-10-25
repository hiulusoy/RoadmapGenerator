module.exports = function (sequelize, DataTypes) {
  let Audit = sequelize.define('Audit', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    module: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    function: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    context: {
      type: DataTypes.JSON, // JSON veri tipi kullanımı
      allowNull: true,
    },
    tenantId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
  });

  // Audit.sync({alter: true});

  return Audit;
};
