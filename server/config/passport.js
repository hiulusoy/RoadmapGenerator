const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const moment = require('moment');
