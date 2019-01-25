"use strict";

var _winston = _interopRequireDefault(require("winston"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _fileHelpers = require("../helpers/fileHelpers.js");

var _userHelpers = require("../helpers/userHelpers.js");

var _constants = require("../common/constants");

var _mongoAPI = require("../helpers/mongoAPI.js");

var _certificateBuilder = require("../helpers/certificateBuilder.js");

var _winstonConfig = require("../modules/winston.config.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * 
 * Contains all the Express Routes for requests related to proofs.
 * @Author: Michael Harrison
 * @Date:   2018-10-29T20:03:41+11:00
 * @Last modified by:   Michael Harrison
 * @Last modified time: 2019-01-16T08:59:58+11:00
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
   * Fetch proof information for a particular document.
   * @param {string} fileId - The id of the file for preview.
   * @returns {Response} Headers containing the file information and the file.
   * @returns {Resposne} 400 and an error if any error occurs during the process.
   */


  app.get('/api/proof/:fileId', function (req, res) {
    var fileId = req.params.fileId;
    var AuthToken = req.cookies.AuthToken;
    logger.log({
      level: 'info',
      message: 'Getting proof of file.',
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
        (0, _mongoAPI.getDocumentProofForFile)(fileInfo[0], user._id).then(function (proof) {
          logger.log({
            level: 'info',
            message: 'Success getting proof for file.',
            proof: proof
          });
          res.status(200).send(proof);
        }).catch(function (getDocumentProofsError) {
          var returnObject = {
            level: 'error',
            message: 'Error checking document proof status.',
            getDocumentProofsError: getDocumentProofsError
          };
          logger.log(returnObject); // @TODO -> Submit a new proof for the SPECIFIC document version, then start again.

          (0, _mongoAPI.createNewProof)().then(function (createNewProofResult) {
            logger.log({
              code: 1,
              level: 'info',
              message: 'Submitted new proof for unproven document.',
              createNewProofResult: createNewProofResult,
              user: user,
              fileName: fileInfo[0].name
            });
            var proof = {
              proofs: [{
                status: 'Pending'
              }]
            };
            res.status(200).send(proof);
          }).catch(function (err) {
            logger.log({
              code: _constants.ERROR_CODES.FAILED_TO_SUBMIT_PROOF,
              level: 'error',
              message: 'Failed to submit new proof for unproven document.',
              err: err,
              user: user,
              fileName: fileInfo[0].name
            });
            res.status(200).send(returnObject);
          });
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
   * Get proof info for a particular version of a file (historical)
   * @param {string} fileName - The name of the file to fetch a historical proof for.
   * @param {number} version - The version at which to fetch the proof.
   * @param {"inline" | "download"} type - Whether to return an inline file or direct download.
   * @returns {Response} Headers containing the file information and the file.
   * @returns {Resposne} 400 and an error if any error occurs during the process.
   */

  app.get('/api/historicalProofInfo/:fileName/:version', function (req, res) {
    var _req$params = req.params,
        fileName = _req$params.fileName,
        version = _req$params.version;
    var AuthToken = req.cookies.AuthToken;
    logger.log({
      level: 'info',
      message: 'Getting proof information (historical) for file.',
      fileName: fileName,
      AuthToken: AuthToken,
      version: version
    });
    (0, _userHelpers.getUserFromToken)(AuthToken, app.get('jwtSecret')).then(function (user) {
      logger.log({
        level: 'debug',
        message: 'Found user from token:',
        userId: user._id
      });
      (0, _mongoAPI.getHistoricalFile)(fileName, user._id, version, null).then(function (fileInfo) {
        (0, _mongoAPI.getDocumentProofForFile)(fileInfo[0], user._id).then(function (documentProofs) {
          if (documentProofs.proofs[0]) {
            (0, _mongoAPI.getVersionProofForFile)(fileInfo[0], false, documentProofs.proofs[0].versionProofId).then(function (proof) {
              logger.log({
                level: 'debug',
                message: 'Found Proof:',
                proof: proof
              });
              res.status(200).send(proof);
            }).catch(function (proofErr) {
              var returnObject = {
                level: 'error',
                message: 'Failed to get proof',
                proofErr: proofErr
              };
              logger.log(returnObject);
              res.status(400).send(returnObject);
            });
          } else {
            var returnObject = {
              level: 'error',
              message: 'No proof found for document'
            };
            logger.log(returnObject);
            res.status(400).send(returnObject);
          }
        }).catch(function (getDocumentProofErr) {
          var returnObject = {
            level: 'error',
            message: 'Failed to get documentproof information',
            getDocumentProofErr: getDocumentProofErr
          };
          logger.log(returnObject);
          res.status(400).send(returnObject);
        });
      });
    }).catch(function (err) {
      var returnObject = {
        level: 'error',
        message: 'Failed to get user.',
        err: err
      };
      logger.log(returnObject);
      res.status(401).sendFile(_path.default.join("".concat(__dirname, "/../pages/failedToGetUser.html")));
    });
  });
  /**
   * Create a PDF Proof certificate for a particular version of a file (historical)
   * @param {string} fileName - The name of the file to fetch a historical proof for.
   * @param {number} version - The version at which to fetch the proof.
   * @param {"inline" | "download"} type - Whether to return an inline file or direct download.
   * @returns {Response} Headers containing the file information and the file.
   * @returns {Resposne} 400 and an error if any error occurs during the process.
   */

  app.get('/api/historicalProof/:type/:fileName/:version', function (req, res) {
    var _req$params2 = req.params,
        fileName = _req$params2.fileName,
        version = _req$params2.version,
        type = _req$params2.type;
    var AuthToken = req.cookies.AuthToken;
    logger.log({
      level: 'info',
      message: 'Getting proof certificate (historical) for file.',
      fileName: fileName,
      AuthToken: AuthToken,
      version: version
    });
    (0, _userHelpers.getUserDetails)(AuthToken, app.get('jwtSecret')).then(function (user) {
      logger.log({
        level: 'debug',
        message: 'Found user from token:',
        userId: user._id
      });
      (0, _mongoAPI.getHistoricalFile)(fileName, user._id, version, null).then(function (fileInfo) {
        (0, _mongoAPI.getDocumentProofForFile)(fileInfo[0], user._id).then(function (documentProof) {
          if (documentProof.proofs[0]) {
            logger.log({
              level: 'debug',
              message: 'Found Document Proof:',
              documentProof: documentProof
            });
            (0, _mongoAPI.getVersionProofForFile)(fileInfo[0], false, documentProof.proofs[0].versionProofId).then(function (versionProof) {
              logger.log({
                level: 'debug',
                message: 'Found Version Proof:',
                versionProof: versionProof
              });
              (0, _certificateBuilder.createPDF)(versionProof, documentProof, fileInfo[0], user).then(function (certPath) {
                logger.log({
                  level: 'info',
                  message: 'Success, Generated Certificate for file:',
                  certPath: certPath,
                  fileName: fileName,
                  user: user
                });

                var file = _fs.default.createReadStream(certPath);

                var stat = _fs.default.statSync(certPath);

                var disposition = 'inline';

                if (type === 'download') {
                  disposition = 'attachment';
                }

                res.setHeader('Content-Length', stat.size);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', "".concat(disposition, "; filename=proof.pdf"));
                file.pipe(res);
              }).catch(function (createCertErr) {
                var returnObject = {
                  level: 'error',
                  message: 'Failed to create certificate with err:',
                  createCertErr: createCertErr
                };
                logger.log(returnObject);
                res.status(400).sendFile(_path.default.join("".concat(__dirname, "/../pages/failedToGetProof.html")));
              });
            }).catch(function (getDocProofErr) {
              var returnObject = {
                level: 'error',
                message: 'Failed to get document proof',
                getDocProofErr: getDocProofErr
              };
              logger.log(returnObject);
              res.status(400).sendFile(_path.default.join("".concat(__dirname, "/../pages/failedToGetProof.html")));
            });
          } else {
            var returnObject = {
              level: 'error',
              message: 'No proofs for file.'
            };
            logger.log(returnObject);
            res.status(400).sendFile(_path.default.join("".concat(__dirname, "/../pages/failedToGetProof.html")));
          }
        }).catch(function (proofErr) {
          var returnObject = {
            level: 'error',
            message: 'Failed to get proof',
            proofErr: proofErr
          };
          logger.log(returnObject);
          res.status(400).sendFile(_path.default.join("".concat(__dirname, "/../pages/failedToGetProof.html")));
        });
      });
    }).catch(function (err) {
      var returnObject = {
        level: 'error',
        message: 'Failed to get user.',
        err: err
      };
      logger.log(returnObject);
      res.status(400).sendFile(_path.default.join("".concat(__dirname, "/../pages/failedToGetUser.html")));
    });
  });
  /**
   * Create a PDF Proof certificate for the latest version of a file.
   * @param {string} fileName - The name of the file to fetch a historical proof for.
   * @param {"inline" | "download"} type - Whether to return an inline file or direct download.
   * @returns {Response} Headers containing the file information and the file.
   * @returns {Resposne} 400 and an error if any error occurs during the process.
   *
   * @TODO -> Use getDocumentProof for some proof information as well.
   */

  app.get('/api/proofCertificate/:type/:fileId', function (req, res) {
    var _req$params3 = req.params,
        fileId = _req$params3.fileId,
        type = _req$params3.type;
    var AuthToken = req.cookies.AuthToken;
    logger.log({
      level: 'info',
      message: 'Getting proof certificate for file.',
      fileId: fileId,
      AuthToken: AuthToken,
      type: type
    });
    (0, _userHelpers.getUserDetails)(AuthToken, app.get('jwtSecret')).then(function (user) {
      logger.log({
        level: 'debug',
        message: 'Found user from token:',
        userId: user._id
      });
      (0, _mongoAPI.getFileInformation)(fileId, user._id, false).then(function (fileInfo) {
        (0, _mongoAPI.getDocumentProofForFile)(fileInfo[0], user._id).then(function (documentProofs) {
          if (documentProofs.proofs[0]) {
            (0, _mongoAPI.getVersionProofForFile)(fileInfo[0], false, documentProofs.proofs[0].versionProofId).then(function (proof) {
              logger.log({
                level: 'debug',
                message: 'Found Version Proof:',
                proof: proof
              });
              (0, _mongoAPI.getDocumentProofForFile)(fileInfo[0], user._id).then(function (documentProof) {
                logger.log({
                  level: 'debug',
                  message: 'Found Document Proof:',
                  documentProof: documentProof
                });
                (0, _certificateBuilder.createPDF)(proof, documentProof, fileInfo[0], user).then(function (certPath) {
                  logger.log({
                    level: 'info',
                    message: 'Generated Certificate for file:',
                    certPath: certPath,
                    fileId: fileId,
                    user: user
                  });

                  var file = _fs.default.createReadStream(certPath);

                  var stat = _fs.default.statSync(certPath);

                  var disposition = 'inline';

                  if (type === 'download') {
                    disposition = 'attachment';
                  }

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
              }).catch(function (getDocProofErr) {
                var returnObject = {
                  level: 'error',
                  message: 'Failed to get document proof',
                  getDocProofErr: getDocProofErr
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
              message: 'No proofs found for document.'
            };
            logger.log(returnObject);
            res.status(400).sendFile(_path.default.join("".concat(__dirname, "/../pages/failedToGetProof.html")));
          }
        }).catch(function (getDocumentProofErr) {
          var returnObject = {
            level: 'error',
            message: 'Failed to get document proof',
            getDocumentProofErr: getDocumentProofErr
          };
          logger.log(returnObject);
          res.status(400).sendFile(_path.default.join("".concat(__dirname, "/../pages/failedToGetProof.html")));
        });
      });
    }).catch(function (err) {
      var returnObject = {
        level: 'error',
        message: 'Failed to get user',
        err: err
      };
      logger.log(returnObject);
      res.status(400).sendFile(_path.default.join("".concat(__dirname, "/../pages/failedToGetUser.html")));
    });
  });
  /**
   * Create a PDF Proof certificate preview for the latest version of a file.
   * @param {string} fileName - The name of the file to fetch a historical proof for.
   * @returns {Response} Headers containing the file information and the file.
   * @returns {Resposne} 400 and an error if any error occurs during the process.
   */

  app.get('/api/proofCertificatePreview/:fileId', function (req, res) {
    var fileId = req.params.fileId;
    var AuthToken = req.cookies.AuthToken;
    logger.log({
      level: 'info',
      message: 'Getting proof certificate for file.',
      fileId: fileId,
      AuthToken: AuthToken
    });
    (0, _userHelpers.getUserDetails)(AuthToken, app.get('jwtSecret')).then(function (user) {
      logger.log({
        level: 'debug',
        message: 'Found user from token:',
        userId: user._id
      });
      (0, _mongoAPI.getFileInformation)(fileId, user._id, false).then(function (fileInfo) {
        (0, _mongoAPI.getDocumentProofForFile)(fileInfo[0], user._id).then(function (documentProofs) {
          if (documentProofs.proofs[0]) {
            (0, _mongoAPI.getVersionProofForFile)(fileInfo[0], false, documentProofs.proofs[0].versionProofId).then(function (proof) {
              logger.log({
                level: 'debug',
                message: 'Found Proof:',
                proof: proof
              });
              (0, _certificateBuilder.createPDF)(proof, documentProofs, fileInfo[0], user).then(function (certPath) {
                logger.log({
                  level: 'debug',
                  message: 'Generated Certificate for file:',
                  certPath: certPath,
                  fileId: fileId,
                  user: user
                }); // Convert PDF to preview

                (0, _fileHelpers.convertFileToHTML)(certPath, {
                  name: 'provendb_certificate.pdf',
                  mimetype: 'application/pdf'
                }).then(function (result) {
                  logger.log({
                    level: 'debug',
                    message: 'Converted file to HTML:',
                    fileName: fileInfo[0].name
                  });
                  (0, _fileHelpers.reduceFileToPreview)(result).then(function (reducedResult) {
                    logger.log({
                      level: 'debug',
                      message: 'Result of file preview reduction',
                      fileName: fileInfo[0].name,
                      reducedResult: reducedResult
                    }); // fs.unlinkSync(
                    //   path.join(__dirname, './uploads/', fileInfo[0].name)
                    // );
                    // fs.unlink(
                    //   path.join(
                    //     __dirname,
                    //     '../../',
                    //     `${fileInfo[0].name}.html`
                    //   ),
                    //   err => {
                    //     if (err) {
                    //       console.log('Failed to remove html preview');
                    //     } else {
                    //       console.log('Removed html preview.');
                    //     }
                    //   }
                    // ); // Temp HTML file.

                    (0, _mongoAPI.checkProofStatus)(fileInfo[0]._provendb_metadata.minVersion).then(function (status) {
                      logger.log({
                        level: 'info',
                        message: 'Success, returning proof certificate preview',
                        status: status
                      });
                      reducedResult.status = status;
                      res.status(200).send(reducedResult);
                    }).catch(function (proofStatusError) {
                      var returnObject = {
                        level: 'error',
                        message: 'Error checking proof status',
                        proofStatusError: proofStatusError
                      };
                      logger.log(returnObject);
                      res.status(400).send(returnObject);
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
              }).catch(function (createCertErr) {
                var returnObject = {
                  level: 'error',
                  message: 'Failed to create Certificate',
                  createCertErr: createCertErr
                };
                logger.log(returnObject);
                res.status(400).send(returnObject);
              });
            }).catch(function (proofErr) {
              var returnObject = {
                level: 'error',
                message: 'Failed to get proof for file',
                proofErr: proofErr
              };
              logger.log(returnObject);
              res.status(400).send(returnObject);
            });
          } else {
            var returnObject = {
              level: 'error',
              message: 'No proofs for file.'
            };
            logger.log(returnObject);
            res.status(400).send(returnObject);
          }
        }).catch(function (getDocumentProofsError) {
          var returnObject = {
            level: 'error',
            message: 'Failed to get document proof for file',
            getDocumentProofsError: getDocumentProofsError
          };
          logger.log(returnObject);
          res.status(400).send(returnObject);
        });
      });
    }).catch(function (err) {
      var returnObject = {
        level: 'error',
        message: 'Failed to get proof for file',
        err: err
      };
      logger.log(returnObject);
      res.status(400).send(returnObject);
    });
  });
};