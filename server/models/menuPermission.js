module.exports = (sequelize, DataTypes) => {
    const MenuPermission = sequelize.define("MenuPermission", {
        menuId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        groupId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tenantId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        hasPermission: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
        tableName: 'MenuPermissions',
        timestamps: false,
    });

    MenuPermission.associate = function (models) {
        MenuPermission.belongsTo(models.Menu, {
            foreignKey: 'menuId',
            as: 'menu'
        });
        MenuPermission.belongsTo(models.Group, {
            foreignKey: 'groupId',
            as: 'group'
        });
    };

    // MenuPermission.sync({alter: true});

    return MenuPermission;
};
