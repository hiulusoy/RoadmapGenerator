module.exports = (sequelize, DataTypes) => {
    const EventParticipant = sequelize.define('EventParticipant', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Events',
                key: 'id'
            }
        },
        participantSource: {
            type: DataTypes.INTEGER, // 0: Student, 1: Teacher, etc.
            allowNull: false
        },
        participantId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tenantId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        facilityId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        createdAt: {
            type: DataTypes.DATE(3),
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)')
        },
        updatedAt: {
            type: DataTypes.DATE(3),
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)')
        }
    });
    //EventParticipant.sync({alter: true});
    return EventParticipant;
};
