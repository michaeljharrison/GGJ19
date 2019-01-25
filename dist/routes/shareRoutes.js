"use strict";

var _winston = _interopRequireDefault(require("winston"));

var _crypto = _interopRequireDefault(require("crypto"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _fileHelpers = require("../helpers/fileHelpers.js");

var _userHelpers = require("../helpers/userHelpers.js");

var _mongoAPI = require("../helpers/mongoAPI.js");

var _constants = require("../common/constants");

var _certificateBuilder = require("../helpers/certificateBuilder.js");

var _winstonConfig = require("../modules/winston.config.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * 
 * Contains all the Express Routes for Sharing requests.
 * @Author: Michael Harrison
 * @Date:   2018-10-29T20:03:41+11:00
 * @Last modified by:   Michael Harrison
 * @Last modified time: 2018-12-18T16:40:57+11:00
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
   * Create a unique share link for the file and place that link in the database for later retrieval.
   * @param {string} fileID - The ID of the file to create a link for.
   * @param {version} version - The version the file exists in.
   * @returns {Response} 200 and the url created..
   * @returns {Response} 400 and an erorr if any errors occcured during the process.
   */


  app.get('/api/getShareStatus/:fileId/:version', function (req, res) {
    var _req$params = req.params,
        fileId = _req$params.fileId,
        version = _req$params.version;
    var AuthToken = req.cookies.AuthToken;
    logger.log({
      level: 'info',
      message: 'Request to get sharing info for file',
      fileId: fileId,
      version: version
    }); // Get User

    (0, _userHelpers.getUserDetails)(AuthToken, app.get('jwtSecret')).then(function (user) {
      (0, _mongoAPI.getSharingInfo)(user._id, fileId, version).then(function (shareInfo) {
        logger.log({
          level: 'info',
          message: 'Got sharing info for file.',
          fileId: fileId,
          shareInfo: shareInfo
        }); // @TODO -> Make debug.

        if (shareInfo.length === 0) {
          // No sharing information.
          res.status(200).send({
            shared: false,
            emails: [],
            link: ''
          });
        } else {
          res.status(200).send({
            shared: true,
            emails: shareInfo[0].emails,
            link: shareInfo[0].url,
            emailLink: shareInfo[0].emailLink
          });
        }
      }).catch(function (getShareErr) {
        var returnObj = {
          level: 'error',
          message: 'Failed to get sharing info',
          fileId: fileId,
          getShareErr: getShareErr
        };
        logger.log(returnObj);
        res.status(404).send(returnObj);
      });
    }).catch(function (getUserErr) {
      var returnObj = {
        level: 'error',
        message: 'Failed to get user for share status.',
        fileId: fileId,
        getUserErr: getUserErr
      };
      logger.log(returnObj);
      res.status(404).send(returnObj);
    });
  });
  app.get('/api/clearShareStatus/:fileId/:version/:type', function (req, res) {
    var _req$params2 = req.params,
        fileId = _req$params2.fileId,
        version = _req$params2.version,
        type = _req$params2.type;
    var AuthToken = req.cookies.AuthToken;
    logger.log({
      level: 'info',
      message: 'Request to clear sharing for file',
      fileId: fileId,
      version: version,
      type: type
    }); // Get User

    (0, _userHelpers.getUserDetails)(AuthToken, app.get('jwtSecret')).then(function (user) {
      (0, _mongoAPI.clearSharingInfo)(user._id, fileId, version, type).then(function (result) {
        logger.log({
          level: 'debug',
          message: 'Result of clear share info',
          result: result
        });
        res.status(200).send(true);
      }).catch(function (clearShareErr) {
        var returnObj = {
          level: 'error',
          message: 'Failed to clear sharing information for file.',
          clearShareErr: clearShareErr
        };
        res.status(400).send(returnObj);
      });
    });
  });
  /**
   * Create a unique share link for the file and place that link in the database for later retrieval.
   * @param {string} fileID - The ID of the file to create a link for.
   * @param {version} version - The version the file exists in.
   * @returns {Response} 200 and the url created..
   * @returns {Response} 400 and an erorr if any errors occcured during the process.
   */

  app.get('/api/createShareLink/:fileId/:version', function (req, res) {
    var _req$params3 = req.params,
        fileId = _req$params3.fileId,
        version = _req$params3.version;
    var AuthToken = req.cookies.AuthToken;
    logger.log({
      level: 'info',
      message: 'Request to create share link for file',
      fileId: fileId,
      version: version
    }); // Get User

    (0, _userHelpers.getUserDetails)(AuthToken, app.get('jwtSecret')).then(function (user) {
      // Generate Share Link
      var shareString = "".concat(user._id, "_").concat(fileId, "_").concat(version, "_").concat(Date.now());

      var hashedString = _crypto.default.createHash('sha256').update(shareString).digest('base64').replace(/\//g, '!');

      var shareLink = "https://provendocs.com/share/".concat(hashedString); // Put share link in database.

      (0, _mongoAPI.addShareLink)(user, fileId, shareLink, version).then(function (shareRes) {
        logger.log({
          level: 'info',
          message: 'Added share link for file',
          fileId: fileId,
          shareRes: shareRes,
          shareLink: shareLink
        }); // @TODO -> Make debug.

        res.status(200).send(shareLink);
      }).catch(function (getShareErr) {
        var returnObj = {
          level: 'error',
          message: 'Failed to get sharing info',
          fileId: fileId,
          getShareErr: getShareErr
        };
        logger.log(returnObj);
        res.status(404).send(returnObj);
      });
    }).catch(function (getUserErr) {
      var returnObj = {
        level: 'error',
        message: 'Failed to get user for share status.',
        fileId: fileId,
        getUserErr: getUserErr
      };
      logger.log(returnObj);
      res.status(404).send(returnObj);
    });
  });
  /**
   * Grant one or more email addresses access to view the users file.
   * @param {string} fileID - The ID of the file to create a link for.
   * @param {version} version - The version the file exists in.
   * @returns {Response} 200 and the url created..
   * @returns {Response} 400 and an erorr if any errors occcured during the process.
   */

  app.post('/api/createShareEmail/:fileId/:version', function (req, res) {
    var _req$params4 = req.params,
        fileId = _req$params4.fileId,
        version = _req$params4.version;
    var emails = req.body;
    var AuthToken = req.cookies.AuthToken;
    logger.log({
      level: 'info',
      message: 'Request to email share for file',
      fileId: fileId,
      version: version,
      emails: emails
    });

    if (!emails) {
      var returnObj = {
        level: 'error',
        message: 'Must provide at least one email to share.'
      };
      res.status(400).send(returnObj);
    } else {
      // Get User
      (0, _userHelpers.getUserDetails)(AuthToken, app.get('jwtSecret')).then(function (user) {
        logger.log({
          level: _constants.DEBUG_LEVELS.DEBUG,
          message: 'Found user:',
          user: user
        }); // Generate Share Link
        // Put share emails in database.

        var shareString = "".concat(Date.now(), "_").concat(user._id, "_").concat(version, "_").concat(fileId, "_");

        var hashedString = _crypto.default.createHash('sha256').update(shareString).digest('base64').replace(/\//g, '!');

        var shareLink = "https://provendocs.com/share/".concat(hashedString); // Add self to user.

        (0, _mongoAPI.addShareEmail)(user, fileId, emails, shareLink, version).then(function (shareRes) {
          logger.log({
            level: 'info',
            message: 'Added shared emails for file...',
            fileId: fileId,
            shareRes: shareRes,
            emails: emails
          }); // @TODO -> Make debug.

          res.status(200).send(shareLink);
        }).catch(function (getShareErr) {
          var returnObj = {
            level: 'error',
            message: 'Failed to get sharing info',
            fileId: fileId,
            getShareErr: getShareErr
          };
          logger.log(returnObj);
          res.status(404).send(returnObj);
        });
      }).catch(function (getUserErr) {
        var returnObj = {
          level: 'error',
          message: 'Failed to get user for share status.',
          fileId: fileId,
          getUserErr: getUserErr
        };
        logger.log(returnObj);
        res.status(404).send(returnObj);
      });
    }
  });
  app.get('/api/checkSharedAccess/:link', function (req, res) {
    var link = req.params.link;
    link = "https://provendocs.com/share/".concat(link);
    var AuthToken = req.cookies.AuthToken;
    logger.log({
      level: 'info',
      message: 'Request to check shared access for file',
      link: link
    });

    if (!link) {
      var returnObj = {
        level: 'error',
        message: 'No link was provided to check access for.'
      };
      res.status(400).send(returnObj);
    } else {
      // Get User
      (0, _userHelpers.getUserDetails)(AuthToken, app.get('jwtSecret')).then(function (user) {
        logger.log({
          level: _constants.DEBUG_LEVELS.DEBUG,
          message: 'Found user from token',
          user: user
        });
        (0, _mongoAPI.getSharedFileFromLink)(link).then(function (sharedDocument) {
          // Check if accessing private or public link.
          logger.log({
            level: _constants.DEBUG_LEVELS.DEBUG,
            message: 'Found shared file for link',
            link: link,
            sharedDocument: sharedDocument
          });

          if (sharedDocument.url && sharedDocument.url === link || sharedDocument.emails && sharedDocument.emails.includes(user.email) || sharedDocument.author === user.email) {
            // Get file name and proof date.
            (0, _mongoAPI.getHistoricalFile)(null, sharedDocument.userId, sharedDocument.version, sharedDocument.fileId).then(function (fileInfo) {
              logger.log({
                level: _constants.DEBUG_LEVELS.DEBUG,
                message: 'Got historical file.',
                name: fileInfo[0].name
              });
              (0, _mongoAPI.getDocumentProofForFile)(fileInfo, sharedDocument.userId).then(function (documentProofs) {
                if (documentProofs.proofs[0]) {
                  (0, _mongoAPI.getVersionProofForFile)(fileInfo[0], false, documentProofs.proofs[0].versionProofId).then(function (proof) {
                    logger.log({
                      level: 'debug',
                      message: 'Got historical proof.',
                      proof: proof
                    });
                    res.status(200).send({
                      fileName: fileInfo[0].name,
                      proofDate: proof.proofs[0].submitted
                    });
                  }).catch(function (getProofErr) {
                    var returnObject = {
                      level: 'error',
                      message: 'Could not get version proof info for file.',
                      getProofErr: getProofErr
                    };
                    logger.log(returnObject);
                    res.status(400).send(returnObject);
                  });
                } else {
                  var returnObject = {
                    level: 'error',
                    message: 'No proof for file.'
                  };
                  logger.log(returnObject);
                  res.status(400).send(returnObject);
                }
              }).catch(function (getDocumentProofErr) {
                // Either file is not publicly shared or not privately shared with this user, reject.
                var returnObject = {
                  level: 'error',
                  message: 'Could not get document proof for file. ',
                  getDocumentProofErr: getDocumentProofErr
                };
                logger.log(returnObject);
                res.status(400).send(returnObject);
              });
            }).catch(function (getFileErr) {
              // Either file is not publicly shared or not privately shared with this user, reject.
              var returnObject = {
                level: 'error',
                message: 'Could not get file info for file.',
                getFileErr: getFileErr
              };
              logger.log(returnObject);
              res.status(400).send(returnObject);
            });
          } else {
            // Either file is not publicly shared or not privately shared with this user, reject.
            var returnObject = {
              level: 'error',
              message: 'You do not have permission to view this page.'
            };
            res.status(400).send(returnObject);
          }
        }).catch(function (getSharedFileErr) {
          var returnObj = {
            level: 'error',
            message: 'Unable to find matching file for link:',
            getSharedFileErr: getSharedFileErr
          };
          res.status(400).send(returnObj);
        });
      }).catch(function (getUserErr) {
        var returnObj = {
          level: 'error',
          message: 'Failed to get user for share status.',
          link: link,
          getUserErr: getUserErr
        };
        logger.log(returnObj);
        res.status(404).send(returnObj);
      });
    }
  });
  app.get('/api/getSharedFile/:link', function (req, res) {
    var link = req.params.link;
    link = "https://provendocs.com/share/".concat(link);
    var AuthToken = req.cookies.AuthToken;
    logger.log({
      level: 'info',
      message: 'Request to get shared file from link',
      link: link
    });

    if (!link) {
      var returnObj = {
        level: 'error',
        message: 'No link was provided to get file for.'
      };
      res.status(400).send(returnObj);
    } else {
      // Get User
      (0, _userHelpers.getUserDetails)(AuthToken, app.get('jwtSecret')).then(function (user) {
        logger.log({
          level: _constants.DEBUG_LEVELS.DEBUG,
          message: 'Found user from token',
          user: user
        });
        (0, _mongoAPI.getSharedFileFromLink)(link).then(function (sharedDocument) {
          // Check if accessing private or public link.
          logger.log({
            level: _constants.DEBUG_LEVELS.DEBUG,
            message: 'Found shared file for link',
            link: link,
            sharedDocument: sharedDocument
          });

          if (sharedDocument.url && sharedDocument.url === link || sharedDocument.emails && sharedDocument.emails.includes(user.email) || sharedDocument.author === user.email) {
            // Public link, share is valid, return file preview
            (0, _mongoAPI.getFileInformation)(sharedDocument.fileId, sharedDocument.userId, false).then(function (fileInfo) {
              (0, _fileHelpers.decodeFile)(fileInfo[0]).then(function (filePath) {
                var file = _fs.default.createReadStream(filePath);

                var stat = _fs.default.statSync(filePath);

                var disposition = 'inline';
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
                  message: 'Failed to decode/get file:',
                  proofErr: proofErr
                };
                logger.log(returnObject);
                res.status(400).sendFile(_path.default.join("".concat(__dirname, "/../pages/failedToGetFile.html")));
              });
            }).catch(function (getFileInfoErr) {
              var returnObject = {
                level: 'error',
                message: 'Failed to get file:',
                getFileInfoErr: getFileInfoErr
              };
              logger.log(returnObject);
              res.status(400).sendFile(_path.default.join("".concat(__dirname, "/../pages/failedToGetFile.html")));
            });
          } else {
            // Either file is not publicly shared or not privately shared with this user, reject.
            var returnObject = {
              level: 'error',
              message: 'You do not have permission to view this page.'
            };
            res.status(400).send(returnObject);
          }
        }).catch(function (getSharedFileErr) {
          var returnObj = {
            level: 'error',
            message: 'Unable to find matching file for link:',
            getSharedFileErr: getSharedFileErr
          };
          res.status(400).send(returnObj);
        });
      }).catch(function (getUserErr) {
        var returnObj = {
          level: 'error',
          message: 'Failed to get user for share status.',
          link: link,
          getUserErr: getUserErr
        };
        logger.log(returnObj);
        res.status(400).sendFile(_path.default.join("".concat(__dirname, "/../pages/failedToGetUser.html")));
      });
    }
  });
  app.get('/api/getSharedProof/:link', function (req, res) {
    var link = req.params.link;
    link = "https://provendocs.com/share/".concat(link);
    var AuthToken = req.cookies.AuthToken;
    logger.log({
      level: 'info',
      message: 'Request to get shared proof from link',
      link: link
    });

    if (!link) {
      var returnObj = {
        level: 'error',
        message: 'No link was provided to get proof for.'
      };
      res.status(400).send(returnObj);
    } else {
      // Get User
      (0, _userHelpers.getUserDetails)(AuthToken, app.get('jwtSecret')).then(function (user) {
        logger.log({
          level: _constants.DEBUG_LEVELS.DEBUG,
          message: 'Found user from token',
          user: user
        });
        (0, _mongoAPI.getSharedFileFromLink)(link).then(function (sharedDocument) {
          // Check if accessing private or public link.
          logger.log({
            level: _constants.DEBUG_LEVELS.DEBUG,
            message: 'Found shared file for link',
            link: link,
            sharedDocument: sharedDocument
          });

          if (sharedDocument.url && sharedDocument.url === link || sharedDocument.emails && sharedDocument.emails.includes(user.email) || sharedDocument.author === user.email) {
            (0, _mongoAPI.getHistoricalFile)(null, sharedDocument.userId, sharedDocument.version, sharedDocument.fileId).then(function (fileInfo) {
              logger.log({
                level: _constants.DEBUG_LEVELS.DEBUG,
                message: 'Got historical file.',
                name: fileInfo[0].name
              });
              (0, _mongoAPI.getDocumentProofForFile)(fileInfo[0], sharedDocument.userId).then(function (documentProofs) {
                if (documentProofs.proofs[0]) {
                  (0, _mongoAPI.getVersionProofForFile)(fileInfo[0], false, documentProofs.proofs[0].versionProofId).then(function (proof) {
                    (0, _certificateBuilder.createPDF)(proof, documentProofs, fileInfo[0], user).then(function (certPath) {
                      logger.log({
                        level: 'info',
                        message: 'Success, Generated Certificate for file:',
                        certPath: certPath,
                        fileName: fileInfo[0].name,
                        user: user
                      });

                      var file = _fs.default.createReadStream(certPath);

                      var stat = _fs.default.statSync(certPath);

                      var disposition = 'inline';
                      res.setHeader('Content-Length', stat.size);
                      res.setHeader('Content-Type', 'application/pdf');
                      res.setHeader('Content-Disposition', "".concat(disposition, "; filename=proof.pdf"));
                      file.pipe(res);
                    }).catch(function (createCertErr) {
                      var returnObject = {
                        level: 'error',
                        message: 'Failed to create Certificate',
                        createCertErr: createCertErr
                      };
                      logger.log(returnObject);
                      res.status(400).sendFile(_path.default.join("".concat(__dirname, "/../pages/failedToGetProof.html")));
                    });
                  }).catch(function (proofErr) {
                    var returnObject = {
                      level: 'error',
                      message: 'Failed to get version proof',
                      proofErr: proofErr
                    };
                    logger.log(returnObject);
                    res.status(400).sendFile(_path.default.join("".concat(__dirname, "/../pages/failedToGetProof.html")));
                  });
                } else {
                  var returnObject = {
                    level: 'error',
                    message: 'No proof for file.'
                  };
                  logger.log(returnObject);
                  res.status(400).sendFile(_path.default.join("".concat(__dirname, "/../pages/failedToGetProof.html")));
                }
              });
            }).catch(function (getFileInfoErr) {
              var returnObject = {
                level: 'error',
                message: 'Failed to get file:',
                getFileInfoErr: getFileInfoErr
              };
              logger.log(returnObject);
              res.status(400).sendFile(_path.default.join("".concat(__dirname, "/../pages/failedToGetProof.html")));
            });
          } else {
            // Either file is not publicly shared or not privately shared with this user, reject.
            var returnObject = {
              level: 'error',
              message: 'You do not have permission to view this page.'
            };
            res.status(400).send(returnObject);
          }
        }).catch(function (getSharedFileErr) {
          var returnObj = {
            level: 'error',
            message: 'Unable to find matching file for link:',
            getSharedFileErr: getSharedFileErr
          };
          res.status(400).send(returnObj);
        });
      }).catch(function (getUserErr) {
        var returnObj = {
          level: 'error',
          message: 'Failed to get user for share status.',
          link: link,
          getUserErr: getUserErr
        };
        logger.log(returnObj);
        res.status(400).sendFile(_path.default.join("".concat(__dirname, "/../pages/failedToGetUser.html")));
      });
    }
  });
};