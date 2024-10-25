module.exports = function (sequelize, DataTypes) {
    let Lookup = sequelize.define('Lookups', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        value: {
            type: DataTypes.STRING,
        },
        attribute1: {
            type: DataTypes.STRING,
        },
        attribute2: {
            type: DataTypes.STRING,
        },
        attribute3: {
            type: DataTypes.STRING,
        },
        attribute4: {
            type: DataTypes.STRING,
        },
        attribute5: {
            type: DataTypes.STRING,
        },
        attribute6: {
            type: DataTypes.INTEGER,
        },
        description: {
            type: DataTypes.STRING,
        },
        createdAt: {
            type: DataTypes.DATE(3),
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)'),
        },
        updatedAt: {
            type: DataTypes.DATE(3),
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)'),
        }
    });

    return Lookup;
};
