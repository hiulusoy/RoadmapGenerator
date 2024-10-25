const env = process.env.NODE_ENV || 'local';
const config = require(__dirname + '/../config/config.js')[env];
const tokenMachine = require('../lib/tokenMachine');
const jwt = require("jsonwebtoken");

module.exports = function (sequelize, DataTypes) {
    let User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true
        }, firstName: {
            type: DataTypes.STRING
        }, lastName: {
            type: DataTypes.STRING
        }, userName: {
            type: DataTypes.STRING
        }, email: {
            type: DataTypes.STRING, allowNull: false, unique: {
                args: true, msg: 'User already exists',
            }
        }, password: {
            type: DataTypes.STRING, allowNull: false,
            // Burada validasyonu kaldırıyoruz
        },
        resetPasswordToken: {
            type: DataTypes.STRING
        },
        resetPasswordExpires: {
            type: DataTypes.DATE
        },
        firebaseId: {
            type: DataTypes.STRING
        },
        createdAt: {
            type: DataTypes.DATE(3), defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)')
        }, updatedAt: {
            type: DataTypes.DATE(3), defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)')
        }, tenantId: {
            type: DataTypes.INTEGER, allowNull: false
        },
        facilityId: {
            type: DataTypes.INTEGER, allowNull: false
        },
        active: {
            type: DataTypes.INTEGER, allowNull: false
        },
    }, {
        timestamps: true,
    });

    User.associate = function (models) {
        User.belongsToMany(models.Group, {
            through: models.UserGroups,
            as: 'groups',
            foreignKey: 'userId',
            otherKey: 'groupId'
        });
    };




    User.prototype.generateResetToken = function () {
        const resetToken = jwt.sign({id: this.id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        this.resetPasswordToken = resetToken;
        this.resetPasswordExpires = Date.now() + 3600000;
        return this.save().then(() => resetToken);
    };

    User.prototype.confirmResetToken = function (userId, token) {
        return new Promise(function (resolve, reject) {
            tokenMachine.generateTokens(config, token)
                .then(function (tokens) {
                    User.findOne({
                        where: {
                            id: userId, resetPasswordExpires: {
                                $gt: Date.now()
                            }, resetPasswordToken: tokens.private
                        }
                    }).then(function (user) {
                        if (!user) {
                            return reject('Malesef şifre değiştirme isteğiniz zaman aşımına uğramıştır, lütfen tekrar deneyiniz.');
                        }
                        resolve(user);
                    }).catch(function (err) {
                        return reject(err);
                    });
                }).catch(function (err) {
                reject(err);
            });
        });
    };

    User.prototype.toJSON = function () {
        const values = Object.assign({}, this.get());
        delete values.password;
        delete values.resetPasswordExpires;
        delete values.resetPasswordToken;
        return values;
    };

    return User;
};
