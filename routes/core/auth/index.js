'use strict';

var express = require('express');
var passport = require('passport');
var config = require('../../../config');
var User = require('../../../models/user');

// Passport Configuration
require('./local/passport').setup(User, config);

var router = express.Router();

router.use('/', require('./local'));
// router.use('/verify/:verification_token', require('./local'));

module.exports = router;
