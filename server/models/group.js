module.exports = function (sequelize, DataTypes) {
    let Group = sequelize.define('Group', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING
        },
        tenantId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        facilityId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
        timestamps: false
    });

    Group.associate = function (models) {
        Group.belongsToMany(models.Resource, {
            through: 'GroupResource',
            foreignKey: 'groupId',
            otherKey: 'resourceId'
        });
    };


    return Group;
};
