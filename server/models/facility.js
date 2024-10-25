module.exports = function (sequelize, DataTypes) {
    let Facility = sequelize.define('Facilities', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        tenantId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        studioCount: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        studentCapacity: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        facilityType: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        openingHours: {
            type: DataTypes.STRING,
            allowNull: true
        },
        closingHours: {
            type: DataTypes.STRING,
            allowNull: true
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true
        },
        zipCode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        managerName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        managerContact: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
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

    Facility.associate = function (models) {
        Facility.belongsTo(models.Tenants, {
            foreignKey: 'tenantId',
            onDelete: 'CASCADE'
        });
    };

    // Facility.sync({alter: true});

    return Facility;
};
