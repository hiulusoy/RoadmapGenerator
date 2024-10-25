module.exports = function (sequelize, DataTypes) {
    let UserGroups = sequelize.define('UserGroups', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id'
            }
        },
        groupId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Group',
                key: 'id'
            }
        },
        tenantId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Tenant',
                key: 'id'
            }
        },
        facilityId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Facility',
                key: 'id'
            }
        },
        entityId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    }, {
        timestamps: false
    });

    UserGroups.associate = function (models) {
        UserGroups.belongsTo(models.User, {foreignKey: 'userId'});
        UserGroups.belongsTo(models.Group, {foreignKey: 'groupId'});
        UserGroups.belongsTo(models.Tenants, {foreignKey: 'tenantId'});
        UserGroups.belongsTo(models.Facilities, {foreignKey: 'facilityId'});
    };

    return UserGroups;
};
