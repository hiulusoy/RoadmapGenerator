const {DataTypes} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Menu = sequelize.define('Menu', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        path: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        icon: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        collapse: {
            type: DataTypes.STRING(255),
        },
        ab: {
            type: DataTypes.STRING(255),
        },
        class: {
            type: DataTypes.STRING(255),
        },
        parentId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'menu',
                key: 'id',
            },
            allowNull: true,
        },
        module: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        order: {
            type: DataTypes.INTEGER
        },
    }, {
        tableName: 'Menus',
        timestamps: false,
    });

    Menu.associate = (models) => {
        Menu.hasMany(models.Menu, {as: 'children', foreignKey: 'parentId'});
        Menu.belongsTo(models.Menu, {as: 'parent', foreignKey: 'parentId'});
    };

    return Menu;
};
