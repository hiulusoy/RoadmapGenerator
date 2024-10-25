const router = require('express').Router();
const {checkToken, checkGroupPermissions} = require('../middlewares/authJwt');

const {failedLoginAttempt} = require('../middlewares/failedLogginAttempt');

module.exports = function (passport, config, db) {
    const AuthController = require('../controllers/authentication/authController')(passport, db);
    const UserController = require('../controllers/core/userController');   
    const LookupController = require('../controllers/core/lookupController');
    const GroupController = require('../controllers/authorization/groupController');
    const ResourceController = require('../controllers/authorization/resourceController');
    const GroupResourceController = require('../controllers/authorization/groupResourceController');
    const TenantController = require('../controllers/authorization/tenantController');
    const MenuController = require('../controllers/authorization/menuController');
    const UserGroupController = require('../controllers/authorization/userGroupController');
    const FacilityController = require('../controllers/facilityController');
    

    // LOOKUP
    router.get('/lookups', [checkToken, checkGroupPermissions], LookupController.getLookups);

    // Authentication
    router.post('/authenticate', failedLoginAttempt, AuthController.authenticateUser);
    router.post('/authenticate/mobile', failedLoginAttempt, AuthController.authenticateUserByMobile);
    router.post('/authenticate/exists', AuthController.ifUserExists);
    router.post('/authenticate/forgot', AuthController.forgotPassword);
    router.post('/authenticate/reset', AuthController.resetPassword);
    router.get('/authenticate/logout', AuthController.logout);
    router.post('/authenticate/migrateUser', AuthController.migrateUserToFirebase);
    router.post('/authenticate/register', [checkToken, checkGroupPermissions], AuthController.register);
    router.post('/authenticate/updateFirebaseEmail', AuthController.updateFirebaseEmail);

    // Users
    router.post('/users/search', [checkToken, checkGroupPermissions], UserController.searchUser);
    router.post('/users/findByUserId', [checkToken, checkGroupPermissions], UserController.findByUserId);
    router.post('/users', [checkToken, checkGroupPermissions], UserController.createUser);
    router.put('/users', [checkToken, checkGroupPermissions], UserController.updateUser);
    router.get('/users/:id', [checkToken, checkGroupPermissions], UserController.getById);
    router.post('/users/findEntitiesWithoutUsers', [checkToken, checkGroupPermissions], UserController.findEntitiesWithoutUsers);
    router.get('/users/:id', [checkToken, checkGroupPermissions], UserController.getById);
    router.post('/users/auth/deactivateUser', [checkToken, checkGroupPermissions], UserController.deactivateUser);
    router.post('/users/auth/lockUserAccount', [checkToken, checkGroupPermissions], UserController.lockUserAccount);
    router.post('/users/auth/unlockUserAccount', [checkToken, checkGroupPermissions], UserController.unlockUserAccount);
    router.post('/users/auth/resetPassword', [checkToken, checkGroupPermissions], UserController.sendResetPasswordLink);
 
    // TENANT CONTROLLER
    router.get('/tenants', [checkToken, checkGroupPermissions], TenantController.getAll);
    router.get('/tenants/:id', [checkToken, checkGroupPermissions], TenantController.getById);
    router.post('/tenants', [checkToken, checkGroupPermissions], TenantController.createTenant);
    router.put('/tenants/:id', [checkToken, checkGroupPermissions], TenantController.updateTenant);
    router.delete('/tenants/:id', [checkToken, checkGroupPermissions], TenantController.deleteTenant);

    // GROUP CONTROLLER
    router.post('/groups/search', [checkToken, checkGroupPermissions], GroupController.search);
    router.post('/groups', [checkToken, checkGroupPermissions], GroupController.create);
    router.put('/groups', [checkToken, checkGroupPermissions], GroupController.update);
    router.delete('/groups', [checkToken, checkGroupPermissions], GroupController.delete);

    // MENU CONTROLLER
    router.post('/menus/search', [checkToken, checkGroupPermissions], MenuController.search);
    router.get('/menus/:id', [checkToken, checkGroupPermissions], MenuController.getMenuDetails);
    router.post('/menus', [checkToken, checkGroupPermissions], MenuController.create);
    router.put('/menus', [checkToken, checkGroupPermissions], MenuController.update);
    router.delete('/menus', [checkToken, checkGroupPermissions], MenuController.delete);

    // RESOURCE CONTROLLER
    router.post('/resources/search', [checkToken, checkGroupPermissions], ResourceController.search);
 
    // GROUP - RESOURCE CONTROLLER
    router.post('/groupResource/search', [checkToken, checkGroupPermissions], GroupResourceController.search);
    router.get('/groupResource/getByGroupId/:groupId', [checkToken, checkGroupPermissions], GroupResourceController.getByGroupId);
    router.post('/groupResource/update/:groupId', [checkToken, checkGroupPermissions], GroupResourceController.updateGroupResource);
    router.post('/groupResource', [checkToken, checkGroupPermissions], GroupResourceController.grantResourceAccessToGroup);
    router.delete('/groupResource/:id', [checkToken, checkGroupPermissions], GroupResourceController.revokeResourceAccessFromGroup);

    // USER - GROUP CONTROLLER
    router.post('/userGroup/search', [checkToken, checkGroupPermissions], UserGroupController.search);
    router.get('/userGroup/getByUserId/:userId', [checkToken, checkGroupPermissions], UserGroupController.getByUserId);
    router.put('/userGroup/:id', [checkToken, checkGroupPermissions], UserGroupController.updateUserGroup);

    // FACILITY CONTROLLER
    router.get('/facility', [checkToken, checkGroupPermissions], FacilityController.getAll);
    router.get('/facility/:id', [checkToken, checkGroupPermissions], FacilityController.getById);
    router.post('/facility', [checkToken, checkGroupPermissions], FacilityController.createFacility);
    router.post('/facility/search', [checkToken, checkGroupPermissions], FacilityController.searchFacility);
    router.put('/facility/:id', [checkToken, checkGroupPermissions], FacilityController.updateFacility);
    router.delete('/facility/:id', [checkToken, checkGroupPermissions], FacilityController.deleteFacility);

    return router;
};
