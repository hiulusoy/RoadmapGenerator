module.exports = function (sequelize, DataTypes) {
    let Tenant = sequelize.define('Tenants', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        domain: {
            type: DataTypes.STRING,
            allowNull: true
        },
        maxUsers: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        activationDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        expiryDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        billingInfo: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        licenseType: {
            type: DataTypes.STRING,
            allowNull: true
        },
        logoUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        theme: {
            type: DataTypes.STRING,
            allowNull: true
        },
        contactEmail: {
            type: DataTypes.STRING,
            allowNull: true
        },
        supportEmail: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'active', // 'active', 'inactive', 'suspended', 'pending'
        },
        apiKey: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        slaLevel: {
            type: DataTypes.STRING,
            allowNull: true
        },
        databaseUrl: {
            type: DataTypes.STRING,
            allowNull: true
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

    // Tenant.sync({alter: true}); 

    return Tenant;
};
