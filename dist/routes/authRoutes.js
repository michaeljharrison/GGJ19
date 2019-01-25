"use strict";

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _winston = _interopRequireDefault(require("winston"));

var _userHelpers = require("../helpers/userHelpers.js");

var _constants = require("../common/constants.js");

var _winstonConfig = require("../modules/winston.config.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Project: /Users/mike/SouthbankSoftware/provendocs/provendocs
 * Created Date: Wednesday September 19th 2018
 * Author: Michael Harrison
 * -----
 * Last Modified: Wednesday September 19th 2018 2:16:04 pm
 * Modified By: Michael Harrison at <Mike@Southbanksoftware.com>
 * -----
 * Copyright (c) 2018 Southbank Software
 */
// const passport = require('passport');
module.exports = function (app) {
  var logger = _winston.default.createLogger({
    transports: [new _winston.default.transports.Console({
      level: process.env.PROVENDOCS_LOG_LEVEL || 'debug',
      json: true,
      colorize: true,
      format: _winstonConfig.authFormat
    })]
  });

  var resetTokenCookies = function resetTokenCookies(req, res) {
    if (req.cookies && req.cookies.AuthToken) {
      res.cookie('AuthToken', '', {
        expires: new Date(Date.now()),
        httpOnly: true
      });
    }

    if (req.cookies && req.cookies.RefreshToken) {
      res.cookie('RefreshToken', '', {
        expires: new Date(Date.now()),
        httpOnly: true
      });
    }
  };

  app.get('/api/serviceUrls', function (req, res) {
    var urls = {};
    urls.ID = process.env.USER_MODULE_URL || 'localhost:8000';
    urls.PROVENDOCS = process.env.DOCS_URL || (process.env.NODE_ENV === 'development' ? 'localhost:3000' : 'localhost:8888');
    urls.API = process.env.API_URL || 'localhost:8080';
    urls.INTERNAL_API = process.env.INTERNAL_API_URL || 'localhost:8080';
    res.status(200).send(JSON.stringify(urls));
  });
  app.get('/api/logout', function (req, res) {
    logger.log({
      level: 'info',
      message: 'Logout Cookies: ',
      cookies: req.cookies
    });
    res.cookie('AuthToken', '', {
      expires: new Date(),
      httpOnly: true
    });
    res.cookie('RefreshToken', '', {
      expires: new Date(),
      httpOnly: true
    });
    res.redirect("http://".concat(_constants.DOMAINS.API, "/auth/logout?redirectURL=http://").concat(_constants.DOMAINS.PROVENDOCS));
  });
  app.get('/api/loginSucceeded', function (req, res) {
    logger.log({
      level: 'info',
      message: 'Login Succeeded Cookies: ',
      cookies: req.cookies
    });
    var _req$query = req.query,
        authToken = _req$query.authToken,
        refreshToken = _req$query.refreshToken;
    logger.log({
      level: 'info',
      message: 'Tokens',
      authToken: authToken,
      refreshToken: refreshToken
    });
    res.cookie('AuthToken', authToken, {
      expires: new Date(Date.now() + 900000),
      httpOnly: true
    });
    res.cookie('RefreshToken', refreshToken, {
      expires: new Date(Date.now() + 900000),
      httpOnly: true
    });
    res.redirect('/dashboard');
  });
  app.get('/api/signupSucceeded', function (req, res) {
    logger.log({
      level: 'info',
      message: 'Signup Succeeded Cookies: ',
      cookies: req.cookies
    });
    var _req$query2 = req.query,
        authToken = _req$query2.authToken,
        refreshToken = _req$query2.refreshToken;
    logger.log({
      level: 'info',
      message: 'Tokens',
      authToken: authToken,
      refreshToken: refreshToken
    });
    res.cookie('AuthToken', authToken, {
      expires: new Date(Date.now() + 90000),
      httpOnly: true
    });
    res.cookie('RefreshToken', refreshToken, {
      expires: new Date(Date.now() + 90000),
      httpOnly: true
    });
    res.redirect('/signupSuccess');
  });
  app.get('/api/loginFailed', function (req, res) {
    logger.log({
      level: 'info',
      message: 'Failed Login Cookies: ',
      cookies: req.cookies
    });
    res.cookie('AuthToken', '', {
      expires: new Date(),
      httpOnly: true
    });
    res.cookie('RefreshToken', '', {
      expires: new Date(),
      httpOnly: true
    });
    res.redirect('/loginFailed');
  });

  function checkStatus(res) {
    logger.log({
      level: 'info',
      message: 'checkStatus',
      res: res
    });

    if (res.ok) {
      // res.status >= 200 && res.status < 300
      return res;
    }

    throw Error(res.statusText);
  }

  app.get('/api/authenticate', function (req, res) {
    logger.log({
      level: 'info',
      message: 'Authenticating cookies',
      cookies: req.cookies
    });

    if (req.cookies && req.cookies.AuthToken && req.cookies.RefreshToken) {
      var AuthToken = req.cookies.AuthToken;

      _jsonwebtoken.default.verify(AuthToken, app.get('jwtSecret'), function (err) {
        if (err && err !== _jsonwebtoken.default.TokenExpiredError) {
          resetTokenCookies(req, res);
          logger.log({
            level: 'error',
            message: "Token is invalid. Error: ".concat(err.message)
          });
          res.status(400).send('Token is invalid.');
        } else {
          var postBody = {
            auth_token: req.cookies.AuthToken,
            refresh_token: req.cookies.RefreshToken
          };
          logger.log({
            level: 'info',
            message: "INTERNAL_API: http://".concat(_constants.DOMAINS.INTERNAL_API, "/auth/verifytoken")
          });
          (0, _nodeFetch.default)("http://".concat(_constants.DOMAINS.INTERNAL_API, "/auth/verifytoken"), {
            method: 'post',
            body: JSON.stringify(postBody),
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(checkStatus).then(function (result) {
            result.json().then(function (jsonResponse) {
              logger.log({
                level: 'info',
                message: 'jsonResponse',
                jsonResponse: jsonResponse
              });

              if (jsonResponse.success === true) {
                res.cookie('AuthToken', jsonResponse.new_auth_token, {
                  expires: new Date(Date.now() + 900000),
                  httpOnly: true
                });
                res.cookie('RefreshToken', jsonResponse.new_refresh_token, {
                  expires: new Date(Date.now() + 900000),
                  httpOnly: true
                });
                logger.log({
                  level: 'info',
                  message: 'User Token is valid'
                });
                res.status(200).send('User token is valid.');
              } else {
                resetTokenCookies(req, res);
                logger.log({
                  level: 'error',
                  message: 'User token is revoked',
                  jsonResponse: jsonResponse
                });
                res.status(400).send('User token is revoked.');
              }
            });
          }).catch(function (error) {
            resetTokenCookies(req, res);
            logger.log({
              level: 'error',
              message: 'Token Authenticaton exception !!!',
              error: error
            });
            res.status(400).send('User token is revoked.');
          });
        }
      });
    } else {
      logger.log({
        level: 'error',
        message: 'Cookies not found.'
      });
      res.status(400).send('Cookies not found.');
    }
  });
  app.get('/api/getUserDetails', function (req, res) {
    var AuthToken = req.cookies.AuthToken;
    logger.log({
      level: 'info',
      message: 'Fetching User Details',
      AuthToken: AuthToken
    });
    (0, _userHelpers.getUserDetails)(AuthToken, app.get('jwtSecret')).then(function (details) {
      logger.log({
        level: 'debug',
        message: 'Got user details',
        details: details
      });
      res.status(200).send(details);
    }).catch(function (getDetailsErr) {
      var returnObj = {
        level: 'error',
        message: 'Failed to fetch user details',
        getDetailsErr: getDetailsErr
      };
      logger.log(returnObj);
      res.status(400).send();
    });
  });
};