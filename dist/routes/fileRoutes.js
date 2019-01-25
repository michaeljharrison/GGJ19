"use strict";

var _winston = _interopRequireDefault(require("winston"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _fileHelpers = require("../helpers/fileHelpers.js");

var _userHelpers = require("../helpers/userHelpers.js");

var _mongoAPI = require("../helpers/mongoAPI.js");

var _constants = require("../common/constants");

var _winstonConfig = require("../modules/winston.config.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * 
 * Contains all the Express Routes for requests related to files.
 * @Author: Michael Harrison
 * @Date:   2018-10-29T20:03:41+11:00
 * @Last modified by:   Michael Harrison
 * @Last modified time: 2019-01-16T08:59:35+11:00
 */
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
   * Get a reduced preview of a file for rendering in the UI.
   * @param {string} fileId - The id of the file for preview.
   * @returns {Response} 200 and the html preview for non-PDF files.
   * @returns {Response} 200 and nothing for a PDF file.
   * @returns {Resposne} 400 and an error if any error occurs during the process.
   */


  app.get('/api/filePreview/:fileId', function (req, res) {
    var fileId = req.params.fileId;
    var AuthToken = req.cookies.AuthToken;
    logger.log({
      level: 'info',
      message: '[REQUEST] -> Getting preview of file for user.',
      fileId: fileId,
      AuthToken: AuthToken
    });
    (0, _userHelpers.getUserFromToken)(AuthToken, app.get('jwtSecret')).then(function (user) {
      logger.log({
        level: 'debug',
        message: 'Found user.',
        userId: user._id
      });
      (0, _mongoAPI.getFileInformation)(fileId, user._id, false).then(function (fileInfo) {
        logger.log({
          level: 'debug',
          message: 'File Metadata: ',
          hasMetadata: fileInfo[0]._provendb_metadata
        });
        (0, _fileHelpers.decodeFile)(fileInfo[0]).then(function (filePath) {
          (0, _fileHelpers.convertFileToHTML)(filePath, fileInfo[0]).then(function (result) {
            logger.log({
              level: 'info',
              message: 'Converted file to HTML:',
              fileName: fileInfo[0].name
            });
            (0, _fileHelpers.reduceFileToPreview)(result, fileInfo[0].mimetype).then(function (reducedResult) {
              logger.log({
                level: 'debug',
                message: 'Result of file preview reduction',
                file: fileInfo[0].name,
                metadata: fileInfo[0]._provendb_metadata.minVersion,
                reducedResult: reducedResult
              });
              (0, _mongoAPI.getDocumentProofForFile)(fileInfo[0], user._id).then(function (documentProofs) {
                logger.log({
                  level: 'debug',
                  message: 'Result of checking proof status:',
                  documentProofs: documentProofs
                });

                if (documentProofs.proofs[0].status) {
                  reducedResult.status = documentProofs.proofs[0].status;
                } else {
                  reducedResult.status = 'Pending';
                }

                logger.log({
                  level: 'debug',
                  message: 'Result of file preview',
                  reducedResult: reducedResult
                });
                res.status(200).send(reducedResult);
              }).catch(function (getDocumentProofsError) {
                var returnObject = {
                  level: 'error',
                  message: 'Error checking document proof status.',
                  getDocumentProofsError: getDocumentProofsError
                };
                logger.log(returnObject); // @TODO -> Submit a new proof for the document version, then start again.

                (0, _mongoAPI.createNewProof)().then(function (createNewProofResult) {
                  logger.log({
                    code: 1,
                    level: 'info',
                    message: 'Submitted new proof for unproven document.',
                    createNewProofResult: createNewProofResult,
                    user: user,
                    fileName: fileInfo[0].name
                  });
                  reducedResult.status = 'Pending';
                  res.status(200).send(reducedResult);
                }).catch(function (err) {
                  logger.log({
                    code: _constants.ERROR_CODES.FAILED_TO_SUBMIT_PROOF,
                    level: 'error',
                    message: 'Failed to submit new proof for unproven document.',
                    err: err,
                    user: user,
                    fileName: fileInfo[0].name
                  });
                  reducedResult.status = 'Unproven';
                  res.status(200).send(returnObject);
                });
              });
            }).catch(function (err) {
              var returnObject = {
                level: 'error',
                message: 'Failed to reduce file to preview',
                fileName: fileInfo[0].name,
                err: err
              };
              logger.log(returnObject);
              res.status(400).send(returnObject);
            });
          }).catch(function (err) {
            var returnObject = {
              level: 'error',
              message: 'Failed to convert file to HTML',
              err: err
            };
            logger.log(returnObject);
            res.status(400).send(returnObject);
          });
        }).catch(function (err) {
          var returnObject = {
            level: 'error',
            message: 'Failed to decode file:',
            err: err
          };
          logger.log(returnObject);
          res.status(400).send(returnObject);
        });
      }).catch(function (err) {
        var returnObject = {
          level: 'error',
          message: 'Failed to get file information',
          err: err
        };
        logger.log(returnObject);
        res.status(400).send(returnObject);
      });
    }).catch(function (err) {
      var returnObject = {
        level: 'error',
        message: 'Failed to get user:',
        err: err
      };
      logger.log(returnObject);
      res.status(401).send(returnObject);
    });
  });
  /**
   * Get a non-reduced preview of a file for rendering in the UI.
   * @param {string} fileId - The id of the file for preview.
   * @returns {Response} 200 and the html preview for non-PDF files.
   * @returns {Response} 200 and nothing for a PDF file.
   * @returns {Resposne} 400 and an error if any error occurs during the process.
   */

  app.get('/api/fullFilePreview/:fileId', function (req, res) {
    var fileId = req.params.fileId;
    var AuthToken = req.cookies.AuthToken;
    logger.log({
      level: 'info',
      message: 'Getting full view of file:',
      fileId: fileId,
      AuthToken: AuthToken
    });
    (0, _userHelpers.getUserFromToken)(AuthToken, app.get('jwtSecret')).then(function (user) {
      logger.log({
        level: 'debug',
        message: 'Found user from token:',
        userId: user._id
      });
      (0, _mongoAPI.getFileInformation)(fileId, user._id, false).then(function (fileInfo) {
        (0, _fileHelpers.decodeFile)(fileInfo[0]).then(function (filePath) {
          (0, _fileHelpers.convertFileToHTML)(filePath, fileInfo[0]).then(function (result) {
            res.status(200).send(result);
          }).catch(function (err) {
            var returnObject = {
              level: 'error',
              message: 'Failed to convert file to HTML:',
              err: err
            };
            logger.log(returnObject);
            res.status(400).send(returnObject);
          });
        }).catch(function (err) {
          var returnObject = {
            level: 'error',
            message: 'Failed to decode file:',
            err: err
          };
          logger.log(returnObject);
          res.status(400).send(returnObject);
        });
      });
    }).catch(function (err) {
      var returnObject = {
        level: 'error',
        message: 'Failed to get user:',
        err: err
      };
      logger.log(returnObject);
      res.status(401).send(returnObject);
    });
  });
  /**
   * Get the file either for download or for inline display (PDF)
   * @param {string} type - The type determines how you want the file e.g inline or download
   * @param {string} fileId - The id of the file for preview.
   * @returns {Response} 200 and the file.
   * @returns {Resposne} 400 and an error if any error occurs during the process.
   */

  app.get('/api/file/:type/:fileId', function (req, res) {
    var _req$params = req.params,
        fileId = _req$params.fileId,
        type = _req$params.type;
    var AuthToken = req.cookies.AuthToken;
    logger.log({
      level: 'info',
      message: 'Getting file:',
      fileId: fileId,
      type: type,
      AuthToken: AuthToken
    });
    (0, _userHelpers.getUserFromToken)(AuthToken, app.get('jwtSecret')).then(function (user) {
      logger.log({
        level: 'debug',
        message: 'Found user from token:',
        userId: user._id
      });
      (0, _mongoAPI.getFileInformation)(fileId, user._id, false).then(function (fileInfo) {
        (0, _fileHelpers.decodeFile)(fileInfo[0]).then(function (filePath) {
          var file = _fs.default.createReadStream(filePath);

          var stat = _fs.default.statSync(filePath);

          var disposition = 'inline';

          if (type === 'download') {
            disposition = 'attachment';
          }

          logger.log({
            level: 'info',
            message: 'Success, Returning File:',
            filePath: filePath,
            fileName: fileInfo[0].name,
            disposition: disposition
          });
          res.setHeader('Content-Length', stat.size);
          res.setHeader('Content-Type', fileInfo[0].mimetype);
          res.setHeader('Content-Disposition', "".concat(disposition, "; filename=\"").concat(fileInfo[0].name.toString(), "\""));
          file.pipe(res);
        }).catch(function (proofErr) {
          var returnObject = {
            level: 'error',
            message: 'Failed to get file:',
            proofErr: proofErr
          };
          logger.log(returnObject);
          res.status(400).sendFile(_path.default.join("".concat(__dirname, "/../pages/failedToGetFile.html")));
        });
      });
    }).catch(function (err) {
      var returnObject = {
        level: 'error',
        message: 'Failed to get user:',
        err: err
      };
      logger.log(returnObject);
      res.status(401).sendFile(_path.default.join("".concat(__dirname, "/../pages/failedToGetUser.html")));
    });
  });
  /**
   * Get the file as it existed at a specific version.
   * @param {string} fileName - The name of the file for preview.
   * @param {number} version - The version at which to fetch the file.
   * @returns {Response} 200 and file as it existed at that version.
   * @returns {Resposne} 400 and an error if any error occurs during the process.
   */

  app.get('/api/fullFileFromHistory/:fileName/:version', function (req, res) {
    var _req$params2 = req.params,
        fileName = _req$params2.fileName,
        version = _req$params2.version;
    var AuthToken = req.cookies.AuthToken;
    logger.log({
      level: 'info',
      message: 'Getting full historical view of file:',
      fileName: fileName,
      version: version,
      AuthToken: AuthToken
    });
    (0, _userHelpers.getUserFromToken)(AuthToken, app.get('jwtSecret')).then(function (user) {
      logger.log({
        level: 'debug',
        message: 'Found user from token:',
        userId: user._id
      });
      (0, _mongoAPI.getHistoricalFile)(fileName, user._id, version, null).then(function (fileInfo) {
        logger.log({
          level: 'debug',
          message: 'File fetched at version',
          fileName: fileInfo[0].name,
          fileVersion: fileInfo[0]._provendb_metadata.minVersion
        });
        (0, _fileHelpers.decodeFile)(fileInfo[0]).then(function (filePath) {
          (0, _fileHelpers.convertFileToHTML)(filePath, fileInfo[0]).then(function (result) {
            logger.log({
              level: 'info',
              message: 'Success in getting file from history'
            });
            res.status(200).send(result);
          }).catch(function (err) {
            var returnObject = {
              level: 'error',
              message: 'Failed to convert file to HTML:',
              err: err
            };
            logger.log(returnObject);
            res.status(400).send(returnObject);
          });
        }).catch(function (err) {
          var returnObject = {
            level: 'error',
            message: 'Failed to decode file:',
            err: err
          };
          logger.log(returnObject);
          res.status(400).send(returnObject);
        });
      });
    }).catch(function (err) {
      var returnObject = {
        level: 'error',
        message: 'Failed to get user',
        err: err
      };
      logger.log(returnObject);
      res.status(401).send(returnObject);
    });
  });
  /**
   * Get the historical file either for download or for inline display (PDF)
   * @param {'email' | 'download'} type - Either inline or download.
   * @param {string} fileName - The id of the file for preview.
   * @param {number} version - The version to fetch the document at.
   * @returns {Response} 200 and the file.
   * @returns {Resposne} 400 and an error if any error occurs during the process.
   */

  app.get('/api/historicalFile/:type/:fileName/:version', function (req, res) {
    var _req$params3 = req.params,
        fileName = _req$params3.fileName,
        version = _req$params3.version,
        type = _req$params3.type;
    var AuthToken = req.cookies.AuthToken;
    logger.log({
      level: 'info',
      message: 'Getting historical file:',
      fileName: fileName,
      version: version,
      AuthToken: AuthToken,
      type: type
    });
    (0, _userHelpers.getUserFromToken)(AuthToken, app.get('jwtSecret')).then(function (user) {
      logger.log({
        level: 'debug',
        message: 'Found user from token:',
        userId: user._id
      });
      (0, _mongoAPI.getHistoricalFile)(fileName, user._id, version, null).then(function (fileInfo) {
        logger.log({
          level: 'debug',
          message: 'File fetched at version',
          fileName: fileInfo[0].name,
          fileVersion: fileInfo[0]._provendb_metadata.minVersion
        });
        (0, _fileHelpers.decodeFile)(fileInfo[0]).then(function (filePath) {
          var file = _fs.default.createReadStream(filePath);

          var stat = _fs.default.statSync(filePath);

          var disposition = 'inline';

          if (type === 'download') {
            disposition = 'attachment';
          }

          logger.log({
            level: 'info',
            message: 'Success, Returning File:',
            filePath: filePath,
            fileName: fileInfo[0].name,
            disposition: disposition
          });
          res.setHeader('Content-Length', stat.size);
          res.setHeader('Content-Type', fileInfo[0].mimetype);
          res.setHeader('Content-Disposition', "".concat(disposition, "; filename=\"").concat(fileInfo[0].name.toString(), "\""));
          file.pipe(res);
        }).catch(function (proofErr) {
          var returnObject = {
            level: 'error',
            message: 'Failed to get file:',
            proofErr: proofErr
          };
          logger.log(returnObject);
          res.status(400).sendFile(_path.default.join("".concat(__dirname, "/../pages/failedToGetFile.html")));
        });
      });
    }).catch(function (err) {
      var returnObject = {
        level: 'error',
        message: 'Failed to get user:',
        err: err
      };
      logger.log(returnObject);
      res.status(401).sendFile(_path.default.join("".concat(__dirname, "/../pages/failedToGetUser.html")));
    });
  });
  /**
   * Get the size of the files currently stored in the users collection.
   * @returns {Response} 200 and an object with the size of the files.
   * @returns {Response} 400 and an error if any error occurs during the process.
   */

  app.get('/api/filesSize', function (req, res) {
    var AuthToken = req.cookies.AuthToken;
    logger.log({
      level: 'info',
      message: 'Getting file sizes.',
      AuthToken: AuthToken
    });
    (0, _userHelpers.getUserFromToken)(AuthToken, app.get('jwtSecret')).then(function (user) {
      logger.log({
        level: 'debug',
        message: 'Found user from token:',
        userId: user._id
      });
      (0, _mongoAPI.getTotalFilesSize)(user._id).then(function (filesSize) {
        logger.info({
          level: 'info',
          message: 'Success in getting file sizes.',
          filesSize: filesSize
        });
        res.status(200).send({
          size: filesSize
        });
      }).catch(function (err) {
        var returnObject = {
          level: 'error',
          message: 'Failed to get files size.:',
          err: err
        };
        logger.log(returnObject);
        res.status(401).send(returnObject);
      });
    });
  });
  /**
   * Get the history of a file with all it's versions.
   * @param {string} fileName - The name of the file to fetch history for.
   * @returns {Response} 200 and an object containing the array of document versions plus metadata.
   * @returns {Resposne} 400 and an error if any error occurs during the process.
   */

  app.get('/api/fileHistory/:fileName', function (req, res) {
    var AuthToken = req.cookies.AuthToken;
    var _req$params4 = req.params,
        fileName = _req$params4.fileName,
        type = _req$params4.type;
    logger.log({
      level: 'info',
      message: ' history for file:',
      fileName: fileName,
      AuthToken: AuthToken,
      type: type
    });
    (0, _userHelpers.getUserFromToken)(AuthToken, app.get('jwtSecret')).then(function (user) {
      logger.log({
        level: 'debug',
        message: 'Found user from token:',
        userId: user._id
      });
      (0, _mongoAPI.getFileHistory)(fileName, user._id).then(function (fileHistory) {
        logger.log({
          level: 'info',
          message: 'Success in getting file history',
          fileName: fileName,
          userID: user._id,
          versionsFound: fileHistory.docHistory.history.versions.length
        });
        res.status(200).send(fileHistory);
      }).catch(function (err) {
        var returnObject = {
          level: 'error',
          message: 'Failed to get file history',
          err: err,
          fileName: fileName
        };
        logger.log(returnObject);
        res.status(400).send(returnObject);
      });
    }).catch(function (err) {
      var returnObject = {
        level: 'error',
        message: 'Failed to get user from token.',
        err: err
      };
      logger.log(returnObject);
      res.status(401).send(returnObject);
    });
  });
  /**
   * Fetch all uploaded files (current version only) for a user.
   * @returns {Response} 200 and an object containing the array of documents uploaded.
   * @returns {Resposne} 400 and an error if any error occurs during the process.
   */

  app.get('/api/fileList', function (req, res) {
    var AuthToken = req.cookies.AuthToken;
    logger.log({
      level: 'info',
      message: 'Getting file list for user:',
      AuthToken: AuthToken
    });
    (0, _userHelpers.getUserFromToken)(AuthToken, app.get('jwtSecret')).then(function (user) {
      logger.log({
        level: 'debug',
        message: 'Found user from token:',
        userId: user._id
      });
      (0, _mongoAPI.getFilesList)(user._id).then(function (result) {
        logger.log({
          level: 'info',
          message: 'Success, Got file list'
        });
        res.status(200).send(result);
      }).catch(function (err) {
        var returnObject = {
          level: 'error',
          message: 'Failed to get docs list.',
          err: err
        };
        logger.log(returnObject);
        res.status(400).send(returnObject);
      });
    }).catch(function (err) {
      var returnObject = {
        level: 'error',
        message: 'Failed to get user from token',
        err: err
      };
      logger.log(returnObject);
      res.status(401).send(returnObject);
    });
  });
};