"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserFromEmail = exports.getUserDetails = exports.getUserFromToken = void 0;

var _file2htmlText = _interopRequireDefault(require("file2html-text"));

var _axios = _interopRequireDefault(require("axios"));

var _file2htmlOoxml = _interopRequireDefault(require("file2html-ooxml"));

var _file2htmlImage = _interopRequireDefault(require("file2html-image"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _graphqlRequest = require("graphql-request");

var file2html = _interopRequireWildcard(require("file2html"));

var _handlebars = require("handlebars");

var _constants = require("../common/constants.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

// import { fileAPIFormat } from '../modules/winston.config.js';
file2html.config({
  readers: [_file2htmlText.default, _file2htmlOoxml.default, _file2htmlImage.default]
});
/* const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: process.env.PROVENDOCS_LOG_LEVEL || 'debug',
      json: true,
      colorize: true,
      format: fileAPIFormat,
    }),
  ],
}); */

/**
 * Queries our back end user service to find a users ID given their JWT token.
 * @param {Object} token - The JWT token provided during login.
 * @param {string} secret - Secret string used to verify the server.
 */

var getUserFromToken = function getUserFromToken(token, secret) {
  return new Promise(function (resolve, reject) {
    _jsonwebtoken.default.verify(token, secret, function (err, decoded) {
      if (err) {
        reject(err);
      } else {
        resolve({
          _id: decoded.sub
        });
      }
    });
  });
};
/**
 * Queries our back end user service to find user details given their JWT token.
 * @param {Object} token - The JWT token provided during login.
 * @param {string} secret - Secret string used to verify the server.
 * @returns {userInformation} - An object containing the users
 */


exports.getUserFromToken = getUserFromToken;

var getUserDetails = function getUserDetails(token, secret) {
  return new Promise(function (resolve, reject) {
    getUserFromToken(token, secret).then(function (user) {
      var userID = user._id;
      var endpoint = "http://".concat(_constants.DOMAINS.INTERNAL_API, "/query");
      var graphQLClient = new _graphqlRequest.GraphQLClient(endpoint, {
        headers: {
          Authorization: "Bearer ".concat(token)
        }
      });
      var query = "\n          {getUser(\n              userID: \"".concat(userID, "\"\n            ) {\n              id\n              email\n              name\n              provider\n              githubID\n              googleID\n          }\n        }\n        ");
      console.log('Query: ', query);
      graphQLClient.request(query).then(function (data) {
        console.log('Data!: ');
        data.getUser._id = data.getUser.id;
        console.log('All G');
        resolve(data.getUser);
      }).catch(function (err) {
        console.log('FAIL -> A: ', err);
        reject(new Error("graphql query failed: ".concat(err.message)));
      });
    }).catch(function (err) {
      reject(new Error("Token not valid: ".concat(err.message)));
    });
  });
};

exports.getUserDetails = getUserDetails;

var getUserFromEmail = function getUserFromEmail(fromEmail) {
  return new Promise(function (resolve, reject) {
    try {
      _handlebars.logger.log({
        level: 'debug',
        message: 'Request to get user from email:',
        fromEmail: fromEmail,
        endpoint: "http://".concat(_constants.DOMAINS.INTERNAL_API, "/api/getuser?email=").concat(fromEmail),
        secret: process.env.PROVENDOCS_SECRET
      });

      var endpoint = "http://".concat(_constants.DOMAINS.INTERNAL_API, "/api/getuser?email=").concat(fromEmail);

      _axios.default // $FlowFixMe
      .get(endpoint, {
        headers: {
          Authorization: "Bearer ".concat(process.env.PROVENDOCS_SECRET)
        }
      }).then(function (res) {
        _handlebars.logger.log({
          level: _constants.DEBUG_LEVELS.DEBUG,
          message: 'Result of get user from email:',
          res: res
        });

        var filteredRes = "".concat(res.data.split('}')[0], "}");

        _handlebars.logger.log({
          level: _constants.DEBUG_LEVELS.DEBUG,
          message: 'Filtered Result of get user from email:',
          filteredRes: filteredRes
        });

        resolve(JSON.parse(filteredRes));
      }).catch(function () {
        console.log('f');
        reject();
      });
    } catch (error) {
      console.log('g');
      reject(error);
    }
  });
};

exports.getUserFromEmail = getUserFromEmail;
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(getUserFromToken, "getUserFromToken", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/userHelpers.js");
  reactHotLoader.register(getUserDetails, "getUserDetails", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/userHelpers.js");
  reactHotLoader.register(getUserFromEmail, "getUserFromEmail", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/userHelpers.js");
  leaveModule(module);
})();

;