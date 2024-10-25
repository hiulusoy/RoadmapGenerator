module.exports = function (sequelize, DataTypes) {
    let File = sequelize.define('File', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        claimId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING
        },
        size: {
            type: DataTypes.INTEGER
        },
        active: {
            type: DataTypes.BOOLEAN
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        tenantId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
        timestamps: false
    });

    return File;
};
