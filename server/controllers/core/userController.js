const _ = require('underscore');
const passwordLib = require('../../lib/passwordLib');
const {
    Op
} = require("sequelize");

const {
    QueryTypes
} = require("sequelize");

const UserService = require('../../service/userService');

const {
    sendResponse,
    sendErrorResponse
} = require('../../utils/controllerUtil');


class UserController {
    constructor() {
        this.userService = UserService;
    }

    getAll = async (req, res) => {
        const users = await this.userService.getAll();
        return sendResponse(res, users);
    }

    findByUserId = async (req, res) => {
        const tenantId = req.tenantId; // Tenant ID requestten geliyor
        const targetUserId = req.body.userId; // userId artık body'den geliyor
        const facilityId = req.facilityId; // Facility ID requestten geliyor
        const loggedUserId = req.userId; // Logged-in user ID requestten geliyor

        try {
            // Servis katmanında searchByUserId metodunu çağır
            const selectedUser = await this.userService.searchByUserId(targetUserId, tenantId, facilityId, loggedUserId);

            // Eğer sonuç başarılıysa yanıtı döndür
            return sendResponse(res, selectedUser, 1);
        } catch (error) {
            // Hata durumunda hata yanıtı gönder
            return sendErrorResponse(res, error.message, error.statusCode);
        }
    };


    searchUser = async (req, res) => {
        const tenantId = req.tenantId;
        const userId = req.userId;
        const facilityId = req.facilityId;
        const filterObj = req.body;


        try {
            const result = await this.userService.searchUser(filterObj, tenantId, userId, facilityId);
            return sendResponse(res, result.users, result.totalCount);
        } catch (error) {
            return sendErrorResponse(res, error.message, error.statusCode);
        }
    }

    // Controller metodu
    findEntitiesWithoutUsers = async (req, res) => {
        const request = {
            entityType: req.body.entityType,
            email: req.body.email,  // Frontend'den gelen email parametresi
            userId: req.userId,
            tenantId: req.tenantId,
            facilityId: req.facilityId
        };

        try {
            const result = await this.userService.findEntitiesWithoutUsers(request);
            return sendResponse(res, result.users, result.totalCount);
        } catch (error) {
            return sendErrorResponse(res, error.message, 404);
        }
    }


    updateBasicUserInformation = async (req, res) => {
        const {
            userId
        } = req.params;
        const {
            firstName,
            lastName
        } = req.body;

        if (!userId) {
            return sendErrorResponse(res, 'UserId is required.', 400);
        }

        try {
            const updatedUser = await this.userService.updateBasicUserInformation(userId, firstName, lastName);
            return sendResponse(res, updatedUser);
        } catch (error) {
            return sendErrorResponse(res, error.message, error.statusCode || 500);
        }
    }

    getById = async (req, res) => {
        const {
            id
        } = req.params;
        const {
            tenantId
        } = req; // Eğer tenantId body'den geliyorsa req.body.tenantId olarak değiştirebilirsiniz.

        if (!id) {
            return sendErrorResponse(res, 'UserId is required.', 400);
        }

        try {
            const user = await this.userService.getUserById(id, tenantId);
            return sendResponse(res, user);
        } catch (error) {
            return sendErrorResponse(res, error.message, error.statusCode || 500);
        }
    }

    createUser = async (req, res) => {
        const {email, firstName, lastName, groupId} = req.body;
        const {tenantId, userId, facilityId} = req;

        try {
            if (!email || !firstName || !lastName || !groupId) {
                return sendErrorResponse(res, 'Email, first name, last name, and group ID are required.', 400);
            }

            const userRequest = {
                email,
                firstName,
                lastName,
                tenantId,
                facilityId,
                active: 1
            };

            const result = await this.userService.createUser(userRequest, groupId, userId);
            return sendResponse(res, result);
        } catch (error) {
            // Daha detaylı hata mesajı ile hata dönmek
            return sendErrorResponse(res, error.message, error.statusCode);
        }
    };


    updateUser = async (req, res) => {
        const userId = req.params.id;
        const tenantId = req.user.tenantId; // Kullanıcı kimliği doğrulandıktan sonra elde edilen tenantId
        const facilityId = req.facilityId;
        const updateData = req.body; // Güncellenecek kullanıcı verileri

        try {
            const result = await this.userService.updateUser(userId, tenantId, updateData, facilityId);
            sendResponse(res, {message: 'User updated successfully.'}); // Başarılı yanıt gönderme
        } catch (error) {
            sendErrorResponse(res, error.message, error.statusCode || 500); // Hata yanıtı gönderme
        }
    }


    deactivateUser = async (req, res) => {
        const {targetUserId} = req.body.targetUserId;
        const {userId, tenantId, facilityId} = req;

        if (!userId) {
            return sendErrorResponse(res, 'UserId is required.', 400);
        }

        try {
            const result = await this.userService.deactivateUser(targetUserId, tenantId, userId, facilityId);
            return sendResponse(res, {message: 'User successfully deactivated.', result});
        } catch (error) {
            return sendErrorResponse(res, error.message, error.statusCode || 500);
        }
    };

    lockUserAccount = async (req, res) => {
        const {targetUserId} = req.body.targetUserId;
        const {userId, tenantId, facilityId} = req;

        if (!userId) {
            return sendErrorResponse(res, 'UserId is required.', 400);
        }

        try {
            const result = await this.userService.lockUserAccount(targetUserId, tenantId, userId, facilityId);
            return sendResponse(res, {message: 'User account successfully locked.', result});
        } catch (error) {
            return sendErrorResponse(res, error.message, error.statusCode || 500);
        }
    };

    unlockUserAccount = async (req, res) => {
        const {targetUserId} = req.body.targetUserId;
        const {userId, tenantId, facilityId} = req;

        if (!userId) {
            return sendErrorResponse(res, 'UserId is required.', 400);
        }

        try {
            const result = await this.userService.unlockUserAccount(targetUserId, tenantId, userId, facilityId);
            return sendResponse(res, {message: 'User account successfully unlocked.', result});
        } catch (error) {
            return sendErrorResponse(res, error.message, error.statusCode || 500);
        }
    };

    // Şifre sıfırlama linki gönderme işlemi (Controller metodu)
    sendResetPasswordLink = async (req, res) => {
        const {email, userId} = req.body; // Email ve userId request body'den alınıyor
        const tenantId = req.tenantId; // Tenant ID request'ten geliyor
        const facilityId = req.facilityId; // Facility ID request'ten geliyor

        if (!email || !userId) {
            return sendErrorResponse(res, 'Email ve userId gereklidir.', 400);
        }

        try {
            // Servis katmanında resetPasswordLink metodunu çağır
            const result = await this.userService.resetPasswordLink(email, userId, tenantId, facilityId);

            // Eğer sonuç başarılıysa yanıtı döndür
            return sendResponse(res, result.message);
        } catch (error) {
            // Hata durumunda hata yanıtı gönder
            return sendErrorResponse(res, error.message, error.statusCode || 500);
        }
    };

}

module.exports = new UserController();
