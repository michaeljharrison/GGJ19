"use strict";

var _winston = _interopRequireDefault(require("winston"));

var _multer = _interopRequireDefault(require("multer"));

var _fileHelpers = require("../helpers/fileHelpers.js");

var _userHelpers = require("../helpers/userHelpers.js");

var _emailHelpers = require("../helpers/emailHelpers.js");

var _mongoAPI = require("../helpers/mongoAPI.js");

var _constants = require("../common/constants");

var _winstonConfig = require("../modules/winston.config.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Contains all the Express Routes for requests related to uploading new files.
 * @Author: Michael Harrison
 * @Date:   2018-10-24T12:41:44+11:00
 * @Last modified by:   Michael Harrison
 * @Last modified time: 2019-01-16T08:58:36+11:00
 */
module.exports = function (app) {
  var upload = (0, _multer.default)({
    dest: 'uploads/',
    limits: {
      fieldSize: 25 * 1024 * 1024
    }
  });

  var logger = _winston.default.createLogger({
    transports: [new _winston.default.transports.Console({
      level: process.env.PROVENDOCS_LOG_LEVEL || 'debug',
      json: true,
      colorize: true,
      format: _winstonConfig.generalFormat
    })]
  });
  /**
   * Upload a document to the database.
   * @param {Array<File>} files - An array of files for uploading.
   * @param {boolean} force - If true, do not check for duplicate files and upload anyway.
   * @returns {Response} 200 and an Object with uploadComplete boolean and matchingFiles Array.
   * @returns {Resposne} 400 and an error if any error occurs during the process.
   */


  app.post('/api/upload/', upload.any(), function (req, res) {
    var AuthToken = req.cookies.AuthToken;
    var files = req.files;
    var _req$body = req.body,
        force = _req$body.force,
        comment = _req$body.comment;
    var tags = req.body.tags;
    tags = tags.split(',');
    logger.log({
      level: 'debug',
      message: 'Force option: ',
      force: force
    });
    logger.log({
      level: _constants.DEBUG_LEVELS.DEBUG,
      message: 'UPLOAD FILES: ',
      files: files
    });

    if (files.length === 0) {
      logger.log({
        level: 'info',
        message: 'No documents to upload.'
      });
      res.status(200).send({
        uploadComplete: true
      });
    } else {
      // First get the user for this token:
      (0, _userHelpers.getUserFromToken)(AuthToken, app.get('jwtSecret')).then(function (user) {
        logger.log({
          level: 'info',
          message: 'Request to upload documents for user',
          user: user,
          comment: comment,
          tags: tags,
          numberOfFiles: files.length
        }); // Check if any of the files exist first:

        (0, _mongoAPI.checkForDuplicates)(files, user._id).then(function (matchingFiles) {
          logger.log({
            level: 'debug',
            message: 'List of matching documents: ',
            matchingFiles: matchingFiles,
            length: matchingFiles.length,
            force: force
          });

          if (matchingFiles.length > 0 && force === 'false') {
            logger.log({
              level: 'info',
              message: 'Found matching files for upload:',
              uploadComplete: false,
              matchingFiles: matchingFiles
            });
            res.status(200).send({
              uploadComplete: false,
              matchingFiles: matchingFiles
            });
          } else {
            // Convert file to binary for putting into Mongo.
            (0, _fileHelpers.convertToBinary)(files).then(function (result) {
              (0, _mongoAPI.uploadFile)(result, files, user._id, comment, tags).then(function () {
                // Once upload is done, clear out uploads folder.

                /*                     const uploadsPath = path.join(__dirname, 'uploads/');
                fs.readdir(uploadsPath, (err, fileList) => {
                if (err) {
                  logger.log({
                    level: 'error',
                    message: 'Failed to clear uploads folder.',
                    err,
                  });
                } else {
                  _.each(fileList, (file) => {
                    const filePath = `${uploadsPath + file}`;
                    fs.unlink(filePath, (unlinkErr) => {
                      if (unlinkErr) {
                        logger.log({
                          level: 'error',
                          message: 'Failed to unlink file.',
                          err,
                        });
                      }
                    });
                  });
                }
                }); */
                (0, _mongoAPI.createNewProof)().then(function () {
                  logger.log({
                    level: 'info',
                    message: 'Succeeded in uploading files',
                    uploadComplete: true,
                    matchingFiles: matchingFiles
                  });
                  res.status(200).send({
                    uploadComplete: true,
                    matchingFiles: []
                  });
                }).catch(function (err) {
                  logger.log({
                    level: 'error',
                    message: 'Error creating new proof:',
                    err: err
                  });
                });
              }).catch(function (err) {
                logger.log({
                  level: 'error',
                  message: 'Error uploading file:',
                  err: err
                });
                res.status(400).send(err);
              });
            }).catch(function (err) {
              logger.log({
                level: 'error',
                message: 'Error converting to binary:',
                err: err
              });
              res.status(400).send(err);
            });
          }
        }).catch(function (checkDupesErr) {
          var returnObj = {
            level: 'error',
            message: 'Error while checking for duplicates:',
            checkDupesErr: checkDupesErr
          };
          logger.log(returnObj);
          res.status(400).send(returnObj);
        });
      }).catch(function (err) {
        logger.log({
          level: 'error',
          message: 'Error finding user:',
          err: err
        });
        res.status(401).send(err);
      });
    }
  });
  /**
   * Upload a new version of a document existing in the database.
   * @param {Array<File>} files - An array of files for uploading.
   * @returns {Response} 200 and an Object with uploadComplete boolean and matchingFiles Array.
   * @returns {Resposne} 400 and an error if any error occurs during the process.
   */

  app.post('/api/uploadNewVersion/', upload.any(), function (req, res) {
    var files = req.files;
    var comment = req.body.comment;
    var tags = req.body.tags;
    tags = tags.split(',');
    var AuthToken = req.cookies.AuthToken;
    logger.log({
      level: 'info',
      message: 'Request to upload new document versions for user',
      files: files,
      comment: comment,
      tags: tags
    });

    if (files.length === 0) {
      logger.log({
        level: 'info',
        message: 'No documents to update.'
      });
      res.status(200).send({
        uploadComplete: true
      });
    } else {
      // First get the user for this token:
      (0, _userHelpers.getUserFromToken)(AuthToken, app.get('jwtSecret')).then(function (user) {
        logger.log({
          level: 'info',
          message: 'Found user from token',
          user: user
        }); // Convert file to binary for putting into Mongo.

        (0, _fileHelpers.convertToBinary)(files).then(function (result) {
          (0, _mongoAPI.updateFile)(result, files, user._id, comment, tags).then(function () {
            // Once upload is done, clear out uploads folder.
            logger.log({
              level: 'debug',
              message: 'Document update complete'
            });
            /* const uploadsPath = path.join(__dirname, 'uploads/');
              fs.readdir(uploadsPath, (err, fileList) => {
              if (err) {
                logger.log({
                  level: 'error',
                  message: 'Failed to clear uploads folder.',
                  err,
                });
              } else {
                _.each(fileList, (file) => {
                  const filePath = `${uploadsPath + file}`;
                  fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) {
                      logger.log({
                        level: 'error',
                        message: 'Failed to unlink file.',
                        err,
                      });
                    }
                  });
                });
              }
            }); */

            (0, _mongoAPI.createNewProof)().then(function () {
              logger.log({
                level: 'info',
                message: 'Success in uploading new file version',
                uploadComplete: true,
                matchingFiles: []
              });
              res.status(200).send({
                uploadComplete: true,
                matchingFiles: []
              });
            }).catch(function (err) {
              logger.log({
                level: 'error',
                message: 'Error creating new proof:',
                err: err
              });
              res.status(400).send({
                level: 'error',
                message: 'Error creating new proof:',
                err: err
              });
            });
          }).catch(function (err) {
            logger.log({
              level: 'error',
              message: 'Error Updating File:',
              err: err
            });
            res.status(400).send({
              level: 'error',
              message: 'Error Updating File:',
              err: err
            });
          });
        }).catch(function (err) {
          logger.log({
            level: 'error',
            message: 'Error converting to binary:',
            err: err
          });
          res.status(400).send({
            level: 'error',
            message: 'Error converting to binary:',
            err: err
          });
        });
      }).catch(function (err) {
        logger.log({
          level: 'error',
          message: 'Error finding user:',
          err: err
        });
        res.status(401).send({
          level: 'error',
          message: 'Error finding user:',
          err: err
        });
      });
    }
  });
  /**
   * Get a list of duplicate documents from a list of new documents to upload.
   * @param {Array<File>} files - An array of files for checking duplicate status..
   * @returns {Response} 200 and an array of duplicate files.
   * @returns {Resposne} 400 and an error if any error occurs during the process.
   */

  app.post('/api/getListOfDuplicates/', upload.any(), function (req, res) {
    var AuthToken = req.cookies.AuthToken;
    var files = req.files;

    if (files.length === 0) {
      logger.log({
        level: 'info',
        message: 'No documents to check.'
      });
      res.status(200).send({
        uploadComplete: true
      });
    } else {
      // First get the user for this token:
      (0, _userHelpers.getUserFromToken)(AuthToken, app.get('jwtSecret')).then(function (user) {
        logger.log({
          level: 'info',
          message: '[REQUEST] -> Check duplicates for user',
          user: user,
          files: files
        }); // Check if any of the files exist first:

        (0, _mongoAPI.checkForDuplicates)(files, user._id).then(function (matchingFiles) {
          logger.log({
            level: 'debug',
            message: 'List of matching documents: ',
            matchingFiles: matchingFiles,
            length: matchingFiles.length
          });
          res.status(200).send(matchingFiles);
        });
      }).catch(function (err) {
        logger.log({
          level: 'error',
          message: 'Error finding user:',
          err: err
        });
        res.status(401).send(err);
      });
    }
  });
  /**
   * Upload an email into a users proven documents.
   * @param {Object} body - Email information from SendGrid, including;
   * @param {string} body.subject - The Subject of the email.
   * @param {string} body.to - The target reciepients of the email.
   * @param {string} body.cc - The target carbon copy reciepients of the email.
   * @param {string} body.sender_ip - The ip of the email sender.
   * @param {string} body.from - The sender of the email
   * @param {string} body.email - The raw email including attachments and content.
   * @returns {boolean} True or an error.
   */

  app.post('/api/uploadEmail', upload.any(), function (req, res) {
    var body = req.body;
    logger.log({
      level: 'info',
      message: '[REQUEST] -> Upload an email'
    });
    var subject = body.subject,
        to = body.to,
        cc = body.cc,
        sender_ip = body.sender_ip,
        from = body.from,
        email = body.email;
    logger.log({
      level: 'info',
      message: 'Email Attributes',
      email: '[REDACTED]',
      subject: subject,
      to: to,
      cc: cc,
      from: from.split('<')[1].slice(0, -1),
      // $FlowFixMe
      sender_ip: sender_ip
    }); // Check that user is a ProvenDB user.

    (0, _userHelpers.getUserFromEmail)(from.split('<')[1].slice(0, -1)).then(function (getUserResult) {
      logger.log({
        level: 'info',
        message: 'Result of get user command',
        result: getUserResult
      }); // Extract Actual email content from email attribute.

      (0, _emailHelpers.extractHTML)({
        email: email
      }).then(_emailHelpers.extractAttachments).then(_emailHelpers.extractMetadata).then(function (result) {
        logger.log({
          level: _constants.DEBUG_LEVELS.DEBUG,
          message: 'Finished Parsing Email...',
          result: result
        });
        var attachments = [];
        result.attachments.forEach(function (value) {
          attachments.push(value.name);
        }); // Generate Binary Data for Email.

        (0, _emailHelpers.convertEmailToBinary)({
          subject: subject,
          to: to,
          from: from,
          cc: cc,
          sender_ip: sender_ip,
          email: email,
          attachments: attachments
        }).then(_emailHelpers.createEmailDocument).then(function (createEmailDocResult) {
          createEmailDocResult.userId = getUserResult.user_id;
          (0, _mongoAPI.uploadAttachments)(result.attachments, getUserResult.user_id).then(function (uploadAttachmentsResult) {
            logger.log({
              level: _constants.DEBUG_LEVELS.DEBUG,
              message: 'Finished Uploading Attachments...',
              uploadAttachmentsResult: uploadAttachmentsResult
            });
            (0, _mongoAPI.uploadEmail)(createEmailDocResult, getUserResult.user_id).then(_mongoAPI.createNewProof).then(function (createNewProofResult) {
              res.status(200).send(createNewProofResult);
            }).catch(function (uploadErr) {
              var returnObj = {
                level: 'error',
                message: 'Failed to upload email.',
                uploadErr: uploadErr
              };
              logger.log(returnObj);
              res.status(404).send(returnObj);
            });
          }).catch(function (uploadAttachmentsError) {
            var returnObj = {
              level: 'error',
              message: 'Failed to upload attachments.',
              uploadAttachmentsError: uploadAttachmentsError
            };
            res.status(404).send(returnObj);
          });
        });
      }).catch(function (extractHTMLErr) {
        var returnObj = {
          level: 'error',
          message: 'Failed to parse email.',
          extractHTMLErr: extractHTMLErr
        };
        logger.log(returnObj);
        res.status(404).send(returnObj);
      });
    }).catch(function (getUserErr) {
      var returnObj = {
        level: 'error',
        message: 'Failed to get user for that email address.'
      };
      returnObj.err = getUserErr;
      logger.log(returnObj);
      res.status(404).send(returnObj);
    });
  });
};