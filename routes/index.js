'use strict';
const auth = require('./core/auth/auth.service');

module.exports = (app) => {
    app
        .all('/*', function(req, res, next) {
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
          res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
          next();
        })
        .use('/', require('./static'))
        .use('/api/v1/auth', require('./core/auth'))
        .use('/api/v1/users', require('./api/user'))
        .use('/api/v1/expenses', require('./api/citation'));
};
