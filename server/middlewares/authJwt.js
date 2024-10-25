const jwt = require('jsonwebtoken');
const NodeCache = require('node-cache');
const cache = new NodeCache();

const db = require('../config/databaseSingleton');

const SUPERADMIN_ID = process.env.SUPERADMIN_USERID;
const SUPERADMIN_TENANT_ID = process.env.SUPERADMIN_TENANTID;

const checkToken = (req, res, next) => {
  try {
    let token = req.headers['authorization'].split('Bearer ')[1];

    if (!token) {
      return res.status(403).send({
        message: 'No token provided!',
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET);
    if (!decoded) {
      return res.status(401).send({
        message: 'Unauthorized!',
      });
    }

    req.userId = decoded.id;
    req.tenantId = decoded.tenantId;
    req.facilityId = decoded.facilityId;
    req.groups = decoded.groups; // JWT içerisindeki grup bilgisi

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: err.message || 'Internal Server Error',
    });
  }
};

function isAuthorized(resources, routePath, routeMethod) {
  return resources.some((resource) => {
    // Dinamik segmentleri genel bir ifadeyle değiştir
    const regexPath = resource.path.replace(/:[a-zA-Z]+/g, '([^/]+)');
    const pattern = new RegExp(`^${regexPath}$`); // Tam yol için regex pattern oluştur
    // console.log(regexPath, 'regexPath');  // Debug: Dönüşmüş regex yolu
    // console.log(pattern, 'pattern');      // Debug: Oluşturulan regex pattern
    // console.log(routePath, 'routePath');  // Debug: İstekten gelen yol
    return pattern.test(routePath) && resource.method === routeMethod;
  });
}

const checkGroupPermissions = async (req, res, next) => {
  if (req.userId == SUPERADMIN_ID && req.tenantId == SUPERADMIN_TENANT_ID) {
    next();
    return;
  }

  const method = req.method.toUpperCase();
  const routePath = req.path;
  const resourcesCacheKey = `resources_${req.userId}_${req.tenantId}${req.facilityId}`; // Ensure unique cache key
  let resources = cache.get(resourcesCacheKey);

  if (resources) {
    resources = JSON.parse(resources); // Parse the resources from the cache
  } else {
    try {
      const userGroupsResources = await db.sequelize.models.UserGroups.findAll({
        where: { userId: req.userId },
        include: [
          {
            model: db.sequelize.models.Group,
            include: [
              {
                model: db.sequelize.models.Resource,
                attributes: ['id', 'path', 'method'],
              },
            ],
          },
        ],
      });

      resources = userGroupsResources.map((ug) => ug.Group.Resources).flat();
      cache.set(resourcesCacheKey, JSON.stringify(resources), 3600); // Serialize the resources before caching
    } catch (error) {
      console.error('Error fetching user groups resources:', error);
      resources = []; // Set resources to empty array in case of error
    }
  }

  if (isAuthorized(resources, routePath, method)) {
    next();
  } else {
    res.status(403).send({
      message: 'Forbidden: You do not have permission to access this resource.',
    });
  }
};

module.exports = {
  checkToken,
  checkGroupPermissions,
};
