module.exports = function (sequelize, DataTypes) {
    let GroupResource = sequelize.define('GroupResource', {
        groupId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Group',
                key: 'id'
            }
        },
        resourceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Resource',
                key: 'id'
            }
        },
        tenantId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
        timestamps: false
    });

    GroupResource.associate = function (models) {
        GroupResource.belongsTo(models.Group, {
            foreignKey: 'groupId'
        });
        GroupResource.belongsTo(models.Resource, {
            foreignKey: 'resourceId'
        });
    };


    return GroupResource;
};