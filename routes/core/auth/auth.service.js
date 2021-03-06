'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../../../config');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var User = require('../../../models/user');
var validateJwt = expressJwt({ secret: config.secrets.session });

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
        console.log('begin');
  return compose()
    // Validate jwt
    .use(function(req, res, next) {
      // allow access_token to be passed through query parameter as well
      if(req.query && req.query.hasOwnProperty('access_token')) {
        console.log('begin2');

        req.headers.authorization = 'Bearer ' + req.query.access_token;
        console.log('authorization');
        console.log(req.headers.authorization);
        console.log('access token');
        console.log(req.query.access_token);
      }
      validateJwt(req, res, next);
    })
    // Attach user to request
    .use(function(req, res, next) {
        console.log('req user2');
      User.findById(req.user._id, function (err, user) {
        if (err) return next(err);
        if (!user) return res.send(401);

        req.user = user;
        console.log('req user');
        console.log(user);
        next();
      });
    });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
  if (!roleRequired) throw new Error('Required role needs to be set');

  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      if (config.userRoles.indexOf(req.user.role) === config.userRoles.indexOf(roleRequired)) {
        next();
      } else {
        res.redirect('/login');
      }
    });
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id, userRole) {
  return jwt.sign({ _id: id, role: userRole }, config.secrets.session, { expiresIn: '2 days' });
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res) {
  if (!req.user) return res.json(404, { message: 'Something went wrong, please try again.'});
  var token = signToken(req.user._id, req.user.role);
  res.cookie('token', JSON.stringify(token));
  res.redirect('/');
}

exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;
