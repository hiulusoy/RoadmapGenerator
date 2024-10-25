module.exports = function (sequelize, DataTypes) {
    const Notification = sequelize.define('Notification', {
      notificationType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      targetId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE(3),
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)'),
      },
      readAt: {
        type: DataTypes.DATE(3),
        allowNull: true,
      },
      deletedAt: {
        type: DataTypes.DATE(3),
        allowNull: true,
      },
      tenantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  
    return Notification;
  };
  