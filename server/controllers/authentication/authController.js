const Sequelize = require('sequelize');
var jwt = require('jsonwebtoken');
const { clearFailedLoginCache } = require('../../middlewares/failedLogginAttempt');
const axios = require('axios'); // HTTP istekleri için axios kullanıyoruz.
const NodeCache = require('node-cache');
const cache = new NodeCache();
const db = require('../../config/databaseSingleton'); // db.sequelize.models.js'in yolunu doğru şekilde belirtin
const { QueryTypes, Op } = require('sequelize');

const { auth, signInWithEmailAndPassword } = require('../../config/firebase-auth'); // Firebase yapılandırmanızı import edin

const firebaseSuperAdmin = require('../../config/firebase-admin');

module.exports = function (passport) {
  async function authenticateUser(req, res) {
    try {
      const { email, password } = req.body;
      const { SUPERADMIN_EMAIL, SUPERADMIN_HASHED_PASSWORD, SUPERADMIN_USERID, SUPERADMIN_TENANTID, SECRET } = process.env;

      if (isSuperAdmin(email, password, SUPERADMIN_EMAIL, SUPERADMIN_HASHED_PASSWORD)) {
        const tokenPayload = { id: SUPERADMIN_USERID, tenantId: SUPERADMIN_TENANTID, facilityId: null };
        const token = generateToken(tokenPayload, SECRET);
        const menusData = await getAllMenus();

        return sendResponse(res, {
          userName: 'SuperAdmin',
          fullName: 'Super Admin',
          accessToken: token,
          expiresIn: 604800,
          menus: buildMenuHierarchy(menusData),
          groups: ['SEA'],
        });
      }

      // Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      if (!firebaseUser) return sendErrorResponse(res, 'User not found.', 404);

      const firebaseToken = await firebaseUser.getIdToken();

      const localUser = await findUserByFirebaseId(firebaseUser.uid);
      if (!localUser) return sendErrorResponse(res, 'User not found in local database.', 404);

      // if (localUser.isLocked) return sendErrorResponse(res, "Hesabınız geçici olarak askıya alındı. Lütfen daha sonra tekrar deneyiniz.", 403);

      const userGroups = await getUserGroups(localUser.id);
      if (userGroups.length === 0) return sendErrorResponse(res, 'No groups found for the user.', 404);

      const menusData = await getUserMenus(userGroups);

      const tokenPayload = { id: localUser.id, tenantId: localUser.tenantId, facilityId: localUser.facilityId };
      const token = generateToken(tokenPayload, SECRET);

      const menus = buildMenuHierarchy(menusData.map((menuPermission) => menuPermission.menu));

      return sendResponse(res, {
        userId: localUser.id,
        userName: firebaseUser.displayName || firebaseUser.email, // FIREBASE DISPLAY NAME
        fullName: `${localUser.firstName} ${localUser.lastName}`,
        accessToken: token,
        expiresIn: 604800,
        menus,
        groups: userGroups.map((ug) => ug.groupName),
      });
    } catch (err) {
      console.error('Authentication error:', err);
      res.status(500).send({ message: 'An unexpected error occurred.' });
    }
  }

  async function authenticateUserByMobile(req, res) {
    try {
      const { email, password } = req.body;
      const { SECRET } = process.env;

      // Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      if (!firebaseUser) return sendErrorResponse(res, 'User not found.', 404);

      const firebaseToken = await firebaseUser.getIdToken();

      const localUser = await findUserByFirebaseId(firebaseUser.uid);
      if (!localUser) return sendErrorResponse(res, 'User not found in local database.', 404);

      // if (localUser.isLocked) return sendErrorResponse(res, "Hesabınız geçici olarak askıya alındı. Lütfen daha sonra tekrar deneyiniz.", 403);

      const userGroups = await getUserGroups(localUser.id);
      if (userGroups.length === 0) return sendErrorResponse(res, 'No groups found for the user.', 404);

      const tokenPayload = { id: localUser.id, tenantId: localUser.tenantId, facilityId: localUser.facilityId };
      const token = generateToken(tokenPayload, SECRET);

      return sendResponse(res, {
        userName: firebaseUser.displayName || firebaseUser.email, // FIREBASE DISPLAY NAME
        fullName: `${localUser.firstName} ${localUser.lastName}`,
        accessToken: token,
        expiresIn: 604800,
        groups: userGroups.map((ug) => ug.groupName),
      });
    } catch (err) {
      console.error('Authentication error:', err);
      res.status(500).send({ message: 'An unexpected error occurred.' });
    }
  }

  async function updateFirebaseEmail(req, res) {
    const { uid, newEmail } = req.body;
    const result = firebaseSuperAdmin.auth().updateUser(uid, {
      email: newEmail,
    });
    return res.status(200).send(result);
  }

  function isSuperAdmin(email, password, superAdminEmail, superAdminHashedPassword) {
    return false;
    // return email === superAdminEmail && bcrypt.compareSync(password, superAdminHashedPassword);
  }

  function generateToken(payload, secret) {
    return jwt.sign(payload, secret, { expiresIn: 604800 });
  }

  async function findUserByEmail(email) {
    return db.sequelize.models.User.findOne({
      where: { email },
      attributes: ['id', 'password', 'isLocked', 'firstName', 'lastName', 'userName', 'tenantId'],
    });
  }

  async function findUserByFirebaseId(firebaseId) {
    return db.sequelize.models.User.findOne({
      where: { firebaseId },
      attributes: ['id', 'isLocked', 'firstName', 'lastName', 'userName', 'tenantId', 'facilityId'],
    });
  }

  async function getUserGroups(userId) {
    const userGroups = await db.sequelize.models.UserGroups.findAll({
      where: { userId },
      include: [{ model: db.sequelize.models.Group }],
    });
    return userGroups.map((ug) => ({
      facilityId: ug.facilityId,
      groupName: ug.Group.name,
      groupId: ug.groupId,
    }));
  }

  async function getUserMenus(userGroups) {
    return db.sequelize.models.MenuPermission.findAll({
      where: { groupId: { [Op.in]: userGroups.map((ug) => ug.groupId) }, hasPermission: true },
      include: [{ model: db.sequelize.models.Menu, as: 'menu' }],
    });
  }

  async function getAllMenus() {
    return db.sequelize.models.Menu.findAll();
  }

  function sendResponse(res, data) {
    return res.status(200).json(data);
  }

  function sendErrorResponse(res, message, statusCode) {
    return res.status(statusCode).send({ message });
  }

  function buildMenuHierarchy(menus) {
    const menuMap = new Map();
    const roots = [];

    menus.forEach((menu) => {
      const routeInfo = {
        id: menu.id,
        path: menu.path,
        title: menu.title,
        type: menu.type,
        icon: menu.icon,
        collapse: menu.collapse,
        ab: menu.ab,
        class: menu.class,
        parentId: menu.parentId,
        module: menu.module,
        order: menu.order, // Add the order property
        children: [],
      };
      menuMap.set(menu.id, routeInfo);
    });

    menus.forEach((menu) => {
      const routeInfo = menuMap.get(menu.id);
      if (menu.parentId) {
        const parentMenu = menuMap.get(menu.parentId);
        if (parentMenu) {
          parentMenu.children.push(routeInfo);
          // Sort children based on order property
          parentMenu.children.sort((a, b) => a.order - b.order);
        }
      } else {
        roots.push(routeInfo);
      }
    });

    // Sort roots based on order property
    roots.sort((a, b) => a.order - b.order);

    return roots;
  }

  return {
    authenticateUser,
    authenticateUserByMobile,
    isSuperAdmin,
    generateToken,
    updateFirebaseEmail,
    findUserByEmail,
    getUserGroups,
    getUserMenus,
    getAllMenus,
    sendResponse,
    sendErrorResponse,
    logout: function (req, res) {
      // Create an audit log entry for the logout action
      db.sequelize.models.Audit.create({
        module: 'auth',
        function: 'logout',
        userId: req && req.user ? req.userId : 0,
      })
        .then(() => {
          // Invalidate the Firebase token if necessary
          if (req && req.user && req.user.firebaseId) {
            auth
              .revokeRefreshTokens(req.user.firebaseId)
              .then(() => {
                // Clear the session cookie
                res.clearCookie('connect.sid', { path: '/' });
                res.status(200).json({ status: 'Successfully logged out.' });
              })
              .catch((error) => {
                console.error('Error revoking refresh tokens:', error);
                res.status(500).json({ status: 'Error logging out.' });
              });
          } else {
            // Clear the session cookie
            res.clearCookie('connect.sid', { path: '/' });
            res.status(200).json({ status: 'Successfully logged out.' });
          }
        })
        .catch((error) => {
          console.error('Error creating audit log:', error);
          res.status(500).json({ status: 'Error logging out.' });
        });
    },
    ifUserExists: function (req, res) {
      if (!req.body.email) {
        return res.status(400).json({ error: 'Missing payload' });
      }

      db.sequelize.models.User.findOne({
        where: { email: req.body.email },
      })
        .then((user) => {
          return res.status(200).json({ exists: !!user });
        })
        .catch((err) => {
          res.status(500).json({ errorMessage: err.message });
        });
    },
    forgotPassword: async function (req, res) {
      if (!req.body || !req.body.email) {
        return res.status(400).send({ error: 'Bir hata oluştu, lütfen destek hattını arayınız.' });
      }

      const userEmail = req.body.email;

      try {
        const user = await db.sequelize.models.User.findOne({ where: { email: userEmail } });
        if (!user) {
          return res.status(400).send({ error: 'Bu email adresiyle kayıtlı kullanıcı yok!' });
        }

        // Firebase üzerinden şifre sıfırlama e-postası gönder
        await firebaseSuperAdmin.auth().generatePasswordResetLink(userEmail);

        // İşlem başarılı ise audit kaydı oluştur
        await db.sequelize.models.Audit.create({
          module: 'auth',
          function: 'forgotPassword',
          userId: 9999999,
        });

        return res.status(200).json({ message: 'Şifrenizi değiştirmek için gerekli bilgiler email adresinize gönderildi.' });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Bir hata oluştu, lütfen destek hattını arayınız.' });
      }
    },
    resetPassword: async function (req, res) {
      if (!req.body || !req.body.token || !req.body.password) {
        return res.status(400).send({ error: 'Bir hata oluştu, lütfen destek hattını arayınız.' });
      }

      try {
        // Firebase üzerinden şifreyi güncelle
        await firebaseSuperAdmin.auth().confirmPasswordReset(req.body.token, req.body.password);

        // İşlem başarılı ise audit kaydı oluştur
        const decodedToken = await firebaseSuperAdmin.auth().verifyIdToken(req.body.token);
        await db.sequelize.models.Audit.create({
          module: 'auth',
          function: 'resetPassword',
          userId: decodedToken.user_id,
        });

        return res.status(200).json({ message: 'Şifreniz başarıyla değiştirildi.' });
      } catch (err) {
        return res.status(500).json({ error: 'Bir hata oluştu, lütfen destek hattını arayınız.' });
      }
    },
    migrateUserToFirebase: async function (req, res) {
      try {
        const userId = req.body.userId;
        const password = req.body.password;

        // Belirtilen userId'ye sahip kullanıcıyı yerel veritabanından al
        const user = await db.sequelize.models.User.findByPk(userId);

        if (!user) {
          throw new Error(`Kullanıcı bulunamadı: ID ${userId}`);
        }

        // Kullanıcıyı Firebase Authentication'da oluştur
        const firebaseUser = await firebaseSuperAdmin.auth().createUser({
          email: user.email,
          password: password,
          displayName: `${user.firstName} ${user.lastName}`,
        });

        // Kullanıcının Firebase UID'sini yerel veritabanında güncelle
        await user.update({ firebaseId: firebaseUser.uid });

        console.log(`Kullanıcı ${user.email} Firebase'e başarıyla taşındı.`);
        return res.status(200).json({
          success: true,
          message: `Kullanıcı ${user.email} Firebase'e başarıyla taşındı.`,
        });
      } catch (error) {
        console.error(`Kullanıcı taşınamadı:`, error);
        return { success: false, message: `Kullanıcı taşınamadı: ${error.message}` };
      }
    },
    register: async function (req, res) {
      const transaction = await Sequelize.transaction();
      try {
        const { firstName, lastName, userName, email, password, tenantId, facilityId } = req.body;

        // Bilgileri doğrulayın
        if (!firstName || !lastName || !userName || !email || !password || !tenantId || !facilityId) {
          return res.status(400).json({ error: 'Tüm alanlar gereklidir.' });
        }

        // Kullanıcıyı yerel veritabanına ekleyin
        const newUser = await User.create(
          {
            firstName,
            lastName,
            userName,
            email,
            tenantId,
            facilityId,
            active: 1,
          },
          { transaction }
        );

        // Firebase'e kullanıcıyı ekleyin
        const firebaseUser = await firebaseSuperAdmin.auth().createUser({
          email: email,
          password: password,
          displayName: `${firstName} ${lastName}`,
        });

        // Firebase UID'sini yerel veritabanına güncelleyin
        await db.sequelize.models.User.update(
          { firebaseId: firebaseUser.uid },
          {
            where: { id: newUser.id },
            transaction,
          }
        );

        await transaction.commit();
        return res.status(201).json({ message: 'Kullanıcı başarıyla kaydedildi.', user: newUser });
      } catch (error) {
        await transaction.rollback();
        console.error('Kayıt hatası:', error);

        if (error.code === 'auth/email-already-exists') {
          return res.status(400).json({ error: 'Bu email adresi zaten kullanılıyor.' });
        }

        return res.status(500).json({ error: 'Bir hata oluştu, lütfen tekrar deneyin.' });
      }
    },
    createTenantAndFacility: async function (tenantData, facilityData, adminData) {
      const transaction = await sequelize.transaction();
      try {
        // 1. Yeni tenant oluştur
        const newTenant = await db.sequelize.models.Tenant.create(tenantData, { transaction });

        // 2. Yeni facility oluştur
        const newFacility = await db.sequelize.models.Facility.create(
          {
            ...facilityData,
            tenantId: newTenant.id,
          },
          { transaction }
        );

        // 3. Admin kullanıcı oluştur
        // const hashedPassword = await bcrypt.hash(adminData.password, 10); //TODO: FIX
        const newAdmin = await db.sequelize.models.User.create(
          {
            ...adminData,
            tenantId: newTenant.id,
            facilityId: newFacility.id,
            password: hashedPassword,
          },
          { transaction }
        );

        // 4. Default grupları ve kaynakları kopyala
        const defaultGroups = await sequelize.query('SELECT * FROM Groups WHERE tenantId IS NULL', { type: Sequelize.QueryTypes.SELECT });

        for (const group of defaultGroups) {
          const newGroup = await db.sequelize.models.Group.create(
            {
              name: group.name,
              description: group.description,
              tenantId: newTenant.id,
            },
            { transaction }
          );

          const groupResources = await sequelize.query('SELECT * FROM GroupResources WHERE groupId = ?', {
            replacements: [group.id],
            type: Sequelize.QueryTypes.SELECT,
          });

          for (const resource of groupResources) {
            await db.sequelize.models.GroupResource.create(
              {
                groupId: newGroup.id,
                resourceId: resource.resourceId,
              },
              { transaction }
            );
          }
        }

        // Transaction'ı commit et
        await transaction.commit();

        return {
          tenant: newTenant,
          facility: newFacility,
          admin: newAdmin,
        };
      } catch (error) {
        // Hata durumunda transaction'ı geri al
        await transaction.rollback();
        throw new Error('Error creating tenant, facility, and admin: ' + error.message);
      }
    },
  };
};
