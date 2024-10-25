module.exports = function (sequelize, DataTypes) {
    let Resource = sequelize.define('Resource', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        method: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    Resource.associate = function (models) {
        Resource.belongsToMany(models.Group, {
            through: 'GroupResource',
            foreignKey: 'resourceId',
            otherKey: 'groupId'
        });
    };

    // Resource.sync({alter: true});

    return Resource;
};