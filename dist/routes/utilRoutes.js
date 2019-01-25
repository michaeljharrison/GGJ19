"use strict";

var _winston = _interopRequireDefault(require("winston"));

var _fs = _interopRequireDefault(require("fs"));

var _archiveBuilder = _interopRequireDefault(require("../helpers/archiveBuilder.js"));

var _userHelpers = require("../helpers/userHelpers.js");

var _mongoAPI = require("../helpers/mongoAPI.js");

var _winstonConfig = require("../modules/winston.config.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * 
 * Contains all the Express Routes for misc. requests.
 * @Author: Michael Harrison
 * @Date:   2018-10-29T20:03:41+11:00
 * @Last modified by:   Michael Harrison
 * @Last modified time: 2019-01-16T14:27:26+11:00
 */
// import User from '../models/User.js';
var _require = require('mongodb'),
    MongoClient = _require.MongoClient;

module.exports = function (app) {
  var logger = _winston.default.createLogger({
    transports: [new _winston.default.transports.Console({
      level: process.env.PROVENDOCS_LOG_LEVEL || 'debug',
      json: true,
      colorize: true,
      format: _winstonConfig.generalFormat
    })]
  });
  /**
   * Check the status of the ProvenDB Proxy to make sure it is avaliable.
   * @returns {Response} 200 and the string "Connected to MongoDB"
   * @returns {Resposne} 500 and the error object.
   */


  app.get('/api/checkStatus', function (req, res) {
    logger.log({
      level: 'info',
      message: 'Checking status of Mongo'
    });
    MongoClient.connect(process.env.PROVENDOCS_URI, {
      useNewUrlParser: true,
      poolSize: 1
    }).then(function (client) {
      if (client) {
        res.status(200).send(true);
      } else {
        res.status(503).send(false);
      }
    }).catch(function () {
      res.status(503).send(false);
    });
  });
  /**
   * Create and download an archive containing proof information for a document.
   * @param {string} fileName - The name of the file requested.
   * @param {version} version - The version the file exists in.
   * @returns {Response} 200 and the .zip file.
   * @returns {Response} 400 and an erorr if any errors occcured during the process.
   */

  app.get('/api/util/getArchive/:fileName/:version', function (req, res) {
    var _req$params = req.params,
        fileName = _req$params.fileName,
        version = _req$params.version;
    var AuthToken = req.cookies.AuthToken;
    logger.log({
      level: 'info',
      message: 'Request to create Archive for file',
      fileName: fileName,
      version: version
    }); // Get User

    (0, _userHelpers.getUserDetails)(AuthToken, app.get('jwtSecret')).then(function (user) {
      logger.log({
        level: 'debug',
        message: 'Got user Details',
        user: user
      });
      (0, _mongoAPI.getHistoricalFile)(fileName, user._id, version, null).then(function (fileInfo) {
        logger.log({
          level: 'info',
          message: 'Got File Details',
          name: fileInfo
        });
        (0, _mongoAPI.getDocumentProofForFile)(fileInfo[0], user._id, 'json').then(function (documentProofs) {
          if (documentProofs.proofs[0]) {
            (0, _mongoAPI.getVersionProofForFile)(fileInfo[0], true, documentProofs.proofs[0].versionProofId).then(function (proof) {
              logger.log({
                level: 'debug',
                message: 'Got Version Proof for file:',
                proof: proof
              });
              (0, _archiveBuilder.default)(fileInfo[0], proof.proofs[0], documentProofs.proofs[0], user).then(function (archivePath) {
                logger.log({
                  level: 'info',
                  message: 'Created archive for file:',
                  archivePath: archivePath
                });

                var file = _fs.default.createReadStream(archivePath);

                var stat = _fs.default.statSync(archivePath);

                var disposition = 'attachment';
                res.setHeader('Content-Length', stat.size);
                res.setHeader('Content-Type', 'application/zip');
                res.setHeader('Content-Disposition', "".concat(disposition, "; filename=").concat(fileInfo[0].name, ".proof.zip"));
                file.pipe(res);
              }).catch(function (createArchiveErr) {
                var returnObj = {
                  level: 'error',
                  message: 'Failed to create Archive for file!',
                  file: fileInfo.name,
                  createArchiveErr: createArchiveErr
                };
                logger.log(returnObj);
                res.status(404).send(returnObj);
              });
            }).catch(function (getProofErr) {
              var returnObj = {
                level: 'error',
                message: 'Failed to get version proof for file!',
                file: fileInfo.name,
                getProofErr: getProofErr
              };
              logger.log(returnObj);
              res.status(404).send(returnObj);
            });
          } else {
            var returnObj = {
              level: 'error',
              message: 'No proofs for file.',
              file: fileInfo.name
            };
            logger.log(returnObj);
            res.status(404).send(returnObj);
          }
        }).catch(function (getDocumentProofsErr) {
          var returnObj = {
            level: 'error',
            message: 'Failed to get document proof for file!',
            file: fileInfo.name,
            getDocumentProofsErr: getDocumentProofsErr
          };
          logger.log(returnObj);
          res.status(404).send(returnObj);
        });
      }).catch(function (getFileErr) {
        var returnObj = {
          level: 'error',
          message: 'Failed to get File infomration for file!',
          fileName: fileName,
          getFileErr: getFileErr
        };
        logger.log(returnObj);
        res.status(404).send(returnObj);
      });
    }).catch(function (getUserErr) {
      var returnObj = {
        level: 'error',
        message: 'Failed to get User for file!',
        fileName: fileName,
        getUserErr: getUserErr
      };
      logger.log(returnObj);
      res.status(404).send(returnObj);
    });
  });
};