const UserRepository = require('../repository/userRepository');
const TrainerRepository = require('../repository/trainerRepository');
const StudentRepository = require('../repository/studentRepository');
const ParentRepository = require('../repository/parentsRepository');
const UserGroupRepository = require('../repository/userGroupRepository');
const GroupRepository = require('../repository/groupRepository');
const db = require('../config/databaseSingleton'); // db.js'in yolunu doğru şekilde belirtin
const EmailService = require('../service/emailService');
const firebaseAdmin = require('../config/firebase-admin');

const passwordLib = require('../lib/passwordLib');
const {generateRandomPassword} = require("../utils/passwordGenerator");
const firebaseSuperAdmin = require("../config/firebase-admin");
const {generatePassword} = require("../lib/passwordLib");

class UserService {
    constructor() {
        this.userRepository = UserRepository;
        this.studentRepository = StudentRepository;
        this.trainerRepository = TrainerRepository;
        this.userGroupsRepository = UserGroupRepository;
        this.groupRepository = GroupRepository;
        this.parentRepository = ParentRepository;
        this.emailService = EmailService;

    }

    searchByUserId = async (userId, tenantId, facilityId, loggedUserId) => {
        try {
            return await this.userRepository.searchByUserId(userId, tenantId, facilityId, loggedUserId);
        } catch (err) {
            throw new Error(`Hata: ${err.message}`);
        }
    }


    searchUser = async (filterObj, tenantId, userId, facilityId) => {
        try {
            return await this.userRepository.searchUser(filterObj, tenantId, userId, facilityId);
        } catch (err) {
            throw new Error(`Hata: ${err.message}`);
        }
    }

    /**
     * Create a new user account.
     * @param {Object} userDetails - An object containing the user's email, first name, last name, tenant ID, and facility ID.
     * @param {Number} groupId - The ID of the group the user belongs to.
     * @param {Number} loggedInUserId - The ID of the logged-in user.
     * @returns {Object} - An object containing a message and the newly created user's ID.
     * @throws {Error} - If the user with the provided email already exists, if the logged-in user is not found, if no groups are found for the logged-in user, if the logged-in user is an admin and tries to create another admin user, if an unexpected error occurs during the process.
     */
    createUser = async (userDetails, groupId, loggedInUserId) => {
        const {email, firstName, lastName, tenantId, facilityId} = userDetails;
        const transaction = await db.sequelize.transaction();

        try {
            const existingUser = await this.userRepository.findUserByEmail(email);
            if (existingUser) {
                throw {message: 'User with the provided email already exists.', statusCode: 400};
            }

            const loggedInUser = await this.userRepository.getById(loggedInUserId, tenantId, facilityId);
            if (!loggedInUser) {
                throw {message: 'Logged in user not found.', statusCode: 404};
            }

            const loggedInUserGroups = await this.userGroupsRepository.getByUserId(loggedInUserId);
            if (!loggedInUserGroups || loggedInUserGroups.length === 0) {
                throw {message: 'No groups found for the logged in user.', statusCode: 404};
            }

            const isAdmin = loggedInUserGroups.userGroups.some(group => group.groupName.toLowerCase() === 'admin');
            if (isAdmin) {
                const targetGroup = await this.groupRepository.findById(groupId);
                if (targetGroup.name.toLowerCase() === 'admin') {
                    throw {message: 'Admins are not allowed to create other admin users.', statusCode: 403};
                }
            }

            // Rastgele bir şifre oluştur
            const randomPassword = generateRandomPassword(10);

            const newUser = {
                email,
                password: 'x', // Geçici şifre, Firebase ile sıfırlama linki gönderilecek.
                firstName,
                lastName,
                userName: `${firstName}${lastName}`,
                tenantId,
                facilityId,
                active: 1
            };

            const createdUser = await this.userRepository.create(newUser, transaction);
            if (!createdUser) {
                throw {message: 'User could not be created.', statusCode: 500};
            }

            let newGroupEntry = {
                userId: createdUser.id,
                groupId,
                tenantId,
                facilityId
            };

            const group = await this.groupRepository.findById(groupId);
            if (group) {
                const groupName = group.name.toUpperCase();
                let entityId = null;

                if (groupName === 'TRAINER') {
                    const trainer = await this.trainerRepository.findByEmail(email);
                    if (trainer) {
                        entityId = trainer.id;
                    } else {
                        throw {message: 'Hocanın mail adresi ile girdiğiniz mail adresi uyuşmuyor.', statusCode: 404};
                    }
                } else if (groupName === 'STUDENT') {
                    const student = await this.studentRepository.findByEmail(email);
                    if (student) {
                        entityId = student.id;
                    } else {
                        throw {
                            message: 'Öğrencinin mail adresi ile girdiğiniz mail adresi uyuşmuyor.',
                            statusCode: 404
                        };
                    }
                } else if (groupName === 'PARENT') {
                    const parent = await this.parentRepository.findByEmail(email);

                    if (parent) {
                        entityId = parent.id;
                    } else {
                        throw {message: 'Velinin mail adresi ile girdiğiniz mail adresi uyuşmuyor', statusCode: 404};
                    }
                }

                if (entityId) {
                    newGroupEntry.entityId = entityId;
                }
            }

            await this.userGroupsRepository.create(newGroupEntry, transaction);

            // Firebase Authentication ile kullanıcı oluşturma
            let firebaseUser;
            try {
                firebaseUser = await firebaseSuperAdmin.auth().createUser({
                    email: email,
                    password: randomPassword,
                    displayName: `${firstName}_${lastName}`
                });
            } catch (error) {
                if (error.code === 'auth/email-already-exists') {
                    // Eğer kullanıcı zaten varsa, bilgilerini alıyoruz
                    firebaseUser = await firebaseSuperAdmin.auth().getUserByEmail(email);
                } else {
                    throw error; // Başka bir hata varsa işlemi durdur
                }
            }

            // Firebase UID ile kullanıcıyı güncelle
            await this.userRepository.updateFirebaseId(createdUser.id, tenantId, firebaseUser.uid, facilityId, transaction);

            // Şifre sıfırlama linki oluşturma
            const resetPasswordLink = await firebaseSuperAdmin.auth().generatePasswordResetLink(email);

            // Kullanıcıya hoş geldiniz e-postası yerine şifre sıfırlama linki gönderin
            await this.emailService.sendWelcomeEmail(email, `${firstName} ${lastName}`, resetPasswordLink);

            await transaction.commit();

            return {
                message: 'Kullanıcı başarıyla oluşturuldu ve bilgileri mail adresine iletildi.',
                userId: createdUser.id
            };
        } catch (error) {
            await transaction.rollback();
            throw new Error(`Transaction rollback due to: ${error.message}`);
        }
    };


    updateUser = async (userId, tenantId, updateData, facilityId) => {
        // Önce kullanıcıyı bul
        const user = await this.userRepository.getById(userId, tenantId, facilityId);
        if (!user) {
            throw new Error('User not found.');
        }

        // Güvenlikle ilgili alanların güncellenmemesini sağla
        const {password, resetPasswordToken, ...safeUpdateData} = updateData;

        // Sadece güvenli alanları güncelle
        await this.userRepository.updateUser(userId, tenantId, safeUpdateData);

        return {message: 'User updated successfully.'};
    }

    getUserById = async (id, tenantId) => {
        const user = await this.userRepository.getById(id, tenantId);
        if (!user) {
            throw new Error(`User with ID ${id} not found.`);
        }
        return user;
    }

    findEntitiesWithoutUsers = async (request) => {
        const user = await this.userRepository.findEntitiesWithoutUsers(request);
        if (!user) {
            throw new Error(`UserService Error: Not found.`);
        }
        return user;
    }


    updateBasicUserInformation = async (userId, firstName, lastName) => {
        if (!firstName || !lastName) {
            throw new Error('First name and last name are required.');
        }

        return await this.userRepository.updateBasicUserInformation(userId, firstName, lastName);
    }

    getAll = () => {
        return this.userRepository.readAll();
    }


    deactivateUser = async (id, tenantId, userId, facilityId) => {
        const user = await this.userRepository.getById(id, tenantId, facilityId);
        if (!user) {
            throw new Error(`User with ID ${id} not found.`);
        }

        return await this.userRepository.deactivateUser(id, tenantId, userId, facilityId);
    }


    lockUserAccount = async (userId, tenantId, loggedInUserId, facilityId) => {
        if (!userId || !tenantId) {
            throw new Error('UserId and tenantId are required.');
        }

        return await this.userRepository.lockUserAccount(userId, tenantId, loggedInUserId, facilityId);
    };

    unlockUserAccount = async (userId, tenantId, loggedInUserId, facilityId) => {
        if (!userId || !tenantId) {
            throw new Error('UserId and tenantId are required.');
        }

        return await this.userRepository.unlockUserAccount(userId, tenantId, loggedInUserId, facilityId);
    };


    resetPasswordLink = async (email, userId, tenantId, facilityId) => {
        try {
            // Firebase şifre sıfırlama linki oluşturma
            const resetLink = await firebaseAdmin.auth().generatePasswordResetLink(email);

            // Kullanıcıya mail gönderme (EmailService'i kullanarak)
            await this.emailService.sendResetPasswordEmail(email, 'Kullanıcı', resetLink); // Burada direkt sendEmail metodu da kullanılabilir.

            // Audit kaydı
            await db.sequelize.models.Audit.create({
                module: 'users',
                function: 'resetPasswordLink',
                context: JSON.stringify({userId, tenantId, facilityId, action: 'resetPassword', targetEmail: email}),
                userId: userId, // işlemi yapan kullanıcı
                tenantId: tenantId,
                facilityId: facilityId,
                createdAt: new Date(),
            });

            return {message: 'Şifre sıfırlama linki başarıyla gönderildi.'};
        } catch (error) {
            console.error('Error sending reset password link:', error);
            throw new Error('Şifre sıfırlama linki gönderilirken bir hata oluştu.');
        }
    };


}

module.exports = new UserService();
