"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDocumentProofForFile = exports.getVersionProofForFile = exports.showMetadata = exports.checkProofStatus = exports.createNewProof = exports.getFileInformation = exports.getTotalFilesSize = exports.getHistoricalFile = exports.getFileHistory = exports.getSharedFileFromLink = exports.addShareEmail = exports.addShareLink = exports.clearSharingInfo = exports.getSharingInfo = exports.getFilesList = exports.updateFile = exports.uploadAttachments = exports.uploadEmail = exports.uploadFile = exports.concatDocs = exports.checkForDuplicates = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _winston = _interopRequireDefault(require("winston"));

var _constants = require("../common/constants");

var _winstonConfig = require("../modules/winston.config.js");

var _fileHelpers = require("./fileHelpers.js");

var _mimetypeHelpers = require("./mimetypeHelpers.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

var _require = require('mongodb'),
    MongoClient = _require.MongoClient;

var mongo = require('mongodb');

var logger = _winston.default.createLogger({
  transports: [new _winston.default.transports.Console({
    level: process.env.PROVENDOCS_LOG_LEVEL || 'debug',
    json: true,
    colorize: true,
    format: _winstonConfig.mongoAPIFormat
  })]
}); // $FlowFixMe


var splitURI = process.env.PROVENDOCS_URI.split('/');
var provendocsDB = splitURI[splitURI.length - 1] || 'provendocs';
var dbObject;
MongoClient.connect(process.env.PROVENDOCS_URI, {
  useNewUrlParser: true,
  poolSize: 1
}).then(function (client) {
  dbObject = client.db(provendocsDB);
}).catch(function (error) {
  return console.error(error);
});
/**
 * Debounced function to ensure we only submit a proof every 5 minutes.
 * The function will be triggered on the first submitProof, and the last (trailing and leading).
 */

var debouncedSubmitProof = _lodash.default.debounce(function () {
  logger.log({
    level: 'debug',
    message: 'Started Debounced function...'
  });

  if (!dbObject) {
    logger.log({
      level: 'error',
      message: 'NO DB OBJECT!'
    });
  }

  dbObject.command({
    getVersion: 1
  }, function (error, res) {
    if (error || !res || res.ok !== 1) {
      logger.log({
        level: 'error',
        message: 'Failed to submitProof with error:',
        error: error
      });
    } else {
      var version = res.version;
      var command = {
        submitProof: version,
        proofType: 'full'
      };
      dbObject.command(command, {}, function (commandError, commandRes) {
        if (commandError) {
          logger.log({
            level: 'error',
            message: 'Failed to submitProof with error:',
            commandError: commandError
          });
        } else {
          logger.log({
            level: 'info',
            message: 'Submitted Proof!',
            commandRes: commandRes
          });
        }
      });
    }
  });
}, process.env.PROVENDOCS_PROOF_DEBOUNCE || 300000, {
  leading: true,
  trailing: true
});
/**
 * Check if there are duplicate files for any file in the given list.
 * @param {*} files - Array of files to determine if duplicates exist for.
 * @param {*} userId  - The ID of the user whom the files belong to.
 * @param {*} nameOnly - Whether the files array only contains file names.
 * @returns {Array<Object>} - An array of documents matching the duplicate query.
 */


var checkForDuplicates = function checkForDuplicates(files, userId, nameOnly) {
  return new Promise(function (resolve, reject) {
    var collection = dbObject.collection("files_".concat(userId));
    logger.log({
      level: 'debug',
      message: 'Finding duplicates for files: ',
      files: files
    }); // Extract document names into a query.

    var fileNameArray = [];

    for (var file = 0; file < files.length; file += 1) {
      if (nameOnly) {
        fileNameArray.push({
          name: files[file]
        });
      } else {
        fileNameArray.push({
          name: files[file].originalname
        });
      }
    }

    var queryFilter = {
      $or: fileNameArray
    };
    var projectionFilter = {
      name: 1
    };
    logger.log({
      level: 'debug',
      message: 'File duplicate query: ',
      queryFilter: queryFilter,
      projectionFilter: projectionFilter
    });

    if (collection) {
      collection.find(queryFilter, {
        promoteLongs: false
      }).project(projectionFilter).toArray(function (queryError, result) {
        if (queryError) {
          logger.log({
            level: 'error',
            message: 'Error finding documents size',
            queryError: queryError
          });
          reject(queryError);
        } else if (result !== []) {
          resolve(result);
        } else {
          logger.log({
            level: 'debug',
            message: 'No files for size. ',
            result: result
          });
          resolve(0);
        }
      });
    } else {
      logger.log({
        level: 'error',
        message: 'Error getting collection'
      });
      reject(new Error({
        message: 'Error getting collection!'
      }));
    }
  });
};
/**
 * Takes in an array of files along with the binary data and concatanates them into a single list.
 * Also double checks to make sure no duplicate files.
 * If a file is found with a duplicate name, generates a new name.
 * @TODO -> Update the name generation logic to be better.
 *
 * @param {Array<string>} binaryData - An array containing the binary format of each file uploaded.
 * @param {Array<Object>} files - An array of objects containing file information such as name.
 * @param {string} userId - The ID of the user who owns the files.
 * @param {boolean} isUpdate - Flag determining if this is an update operation. (Default: FALSE)
 * @param {string} comment - Any specified comment for this upload entered by the user. (Default: '')
 * @param {Array<string>} tags - An array of any tags specified for this upload by the user. (Default: [])
 * @returns {Array<Object>} - Returns an array of files with their metadata for inserting into MongoDB.
 */


exports.checkForDuplicates = checkForDuplicates;

var concatDocs = function concatDocs(binaryData, files, userId, isUpdate, comment, tags) {
  return new Promise(function (resolve, reject) {
    var documentArray = [];

    _lodash.default.forEach(binaryData, function (pair) {
      var file = pair.file,
          encodedFile = pair.encodedFile;
      var newDocument = {
        name: file.originalname,
        encoding: file.encoding,
        size: file.size,
        mimetype: file.mimetype,
        userId: userId,
        binaryData: encodedFile,
        uploadedAt: new Date(Date.now()).toISOString(),
        comment: comment,
        tags: tags
      };
      var queryFilter = {
        name: newDocument.name
      };
      var projectionFilter = {
        name: newDocument.name
      };
      var collection = dbObject.collection("files_".concat(userId)); // Check if document name is already taken.

      if (collection) {
        collection.find(queryFilter, {
          promoteLongs: false
        }).project(projectionFilter).toArray(function (queryError, result) {
          if (queryError) {
            logger.log({
              level: 'error',
              message: 'Error finding documents size',
              queryError: queryError
            });
            reject(queryError);
          } else if (result.length !== 0) {
            logger.log({
              level: 'debug',
              message: 'Found matching document for file:',
              fileName: newDocument.name,
              result: result,
              length: result.length
            });

            if (isUpdate) {
              // If update, simply push document as is.
              documentArray.push(newDocument);

              if (documentArray.length === binaryData.length) {
                resolve(documentArray);
              }
            } else {
              // Found some documents with matching names.
              (0, _fileHelpers.generateNewFileName)(newDocument.name, newDocument.mimetype).then(function (newName) {
                logger.log({
                  level: 'debug',
                  message: 'Generated new name for file',
                  original: newDocument.name,
                  generated: newName
                });
                newDocument.name = newName;
                documentArray.push(newDocument);

                if (documentArray.length === binaryData.length) {
                  resolve(documentArray);
                }
              }).catch(function (err) {
                reject(err);
              });
            }
          } else {
            // Found no documents with matching names.
            documentArray.push(newDocument);

            if (documentArray.length === binaryData.length) {
              resolve(documentArray);
            }
          }
        });
      } else {
        logger.log({
          level: 'error',
          message: 'Error getting collection'
        });
        reject(new Error({
          message: 'Error getting collection!'
        }));
      }
    });
  });
};
/**
 * Uploads one or more files into MongoDB.
 * @param {Array<string>} binaryData - An array containing the binary format of each file uploaded.
 * @param {Array<Object>} files - An array of objects containing file information such as name.
 * @param {string} userId - The ID of the user who owns the files.
 * @param {boolean} isUpdate - Flag determining if this is an update operation. (Default: FALSE)
 * @param {string} comment - Any specified comment for this upload entered by the user. (Default: '')
 * @param {Array<string>} tags - An array of any tags specified for this upload by the user. (Default: [])
 * @returns {boolean | Error} - Returns either true, or an error if there is a failure.
 */


exports.concatDocs = concatDocs;

var uploadFile = function uploadFile(binaryData, files, userId, comment, tags) {
  return new Promise(function (resolve, reject) {
    var collection = dbObject.collection("files_".concat(userId));

    if (collection) {
      // For each file, add the document.
      concatDocs(binaryData, files, userId, false, comment, tags).then(function (documentArray) {
        collection.insertMany(documentArray, function (insertError) {
          if (insertError) {
            logger.log({
              level: 'error',
              message: 'Error inserting document.',
              insertError: insertError
            });
            reject(insertError);
          } else {
            logger.log({
              level: 'debug',
              message: 'Document inserted.'
            });
            resolve(true);
          }
        });
      }).catch(function (error) {
        reject(error);
      });
    } else {
      logger.log({
        level: 'error',
        message: 'Error getting collection'
      });
      reject(new Error({
        message: 'Error getting collection!'
      }));
    }
  });
};
/**
 * Upload an email into a users provendocs account.
 * @param {*} emailData - An object containing the email information for upload.
 * @param {*} userId - The ID of the user for the email to be uploaded for.
 * @returns - Resolves true, or an error.
 */


exports.uploadFile = uploadFile;

var uploadEmail = function uploadEmail(emailData, userId) {
  return new Promise(function (resolve, reject) {
    var collection = dbObject.collection("files_".concat(userId));

    if (collection) {
      collection.insertOne(emailData, function (insertError) {
        if (insertError) {
          logger.log({
            level: 'error',
            message: 'Error inserting document.',
            insertError: insertError
          });
          reject(insertError);
        } else {
          logger.log({
            level: 'debug',
            message: 'Document inserted.'
          });
          resolve(true);
        }
      });
    } else {
      logger.log({
        level: 'error',
        message: 'Error getting collection'
      });
      reject(new Error({
        message: 'Error getting collection!'
      }));
    }
  });
};

exports.uploadEmail = uploadEmail;

var uploadAttachments = function uploadAttachments(attachmentArray, userId) {
  return new Promise(function (resolve, reject) {
    var collection = dbObject.collection("files_".concat(userId));

    if (collection) {
      attachmentArray.forEach(function (attachment) {
        // Create document for inserting.
        var now = new Date(Date.now()).toISOString();
        var name = attachment.name,
            mimetype = attachment.mimetype,
            encoding = attachment.encoding,
            size = attachment.size,
            binaryData = attachment.binaryData;
        var fileName = "".concat(name, "_email_").concat(now, ".").concat(mimetype.split('/')[1]);
        (0, _mimetypeHelpers.fixBinaryData)(binaryData, mimetype).then(function (newBinaryData) {
          // Insert document.
          collection.insertMany({
            name: fileName,
            // @ TODO -> Figure out a better scheme for naming email attachments.
            mimetype: mimetype,
            encoding: encoding,
            binaryData: newBinaryData,
            size: size,
            uploadedAt: now,
            tags: [''],
            comment: ''
          }, function (insertError) {
            if (insertError) {
              logger.log({
                level: 'error',
                message: 'Error inserting document.',
                insertError: insertError
              });
            } else {
              logger.log({
                level: _constants.DEBUG_LEVELS.DEBUG,
                message: 'Document inserted.'
              });
            }
          });
        });
      });
      resolve(true);
    } else {
      logger.log({
        level: 'error',
        message: 'Error getting collection'
      });
      reject(new Error({
        message: 'Error getting collection!'
      }));
    }
  });
};
/**
 * Updates one or more files in MongoDB.
 * @param {Array<string>} binaryData - An array containing the binary format of each file uploaded.
 * @param {Array<Object>} files - An array of objects containing file information such as name.
 * @param {string} userId - The ID of the user who owns the files.
 * @param {boolean} isUpdate - Flag determining if this is an update operation. (Default: FALSE)
 * @param {string} comment - Any specified comment for this upload entered by the user. (Default: '')
 * @param {Array<string>} tags - An array of any tags specified for this upload by the user. (Default: [])
 * @returns {boolean | Error} - Returns either true, or an error if there is a failure.
 */


exports.uploadAttachments = uploadAttachments;

var updateFile = function updateFile(binaryData, files, userId, comment, tags) {
  return new Promise(function (resolve, reject) {
    var collection = dbObject.collection("files_".concat(userId));

    if (collection) {
      // For each file, add the document.
      concatDocs(binaryData, files, userId, true, '', []).then(function (documentArray) {
        _lodash.default.forEach(documentArray, function (document) {
          logger.log({
            level: 'debug',
            message: 'Updating the following document: ',
            name: document.name,
            comment: comment,
            tags: tags
          });
          var newUploadDate = new Date(Date.now()).toISOString();
          var filter = {
            name: document.name
          };
          var update = {
            $set: {
              binaryData: document.binaryData,
              uploadedAt: newUploadDate,
              comment: comment,
              tags: tags
            }
          };
          collection.updateOne(filter, update, function (error, count, status) {
            if (error) {
              logger.log({
                level: 'error',
                message: 'Error updating documents.',
                error: error
              });
              reject(error);
            } else {
              logger.log({
                level: 'debug',
                message: 'Documents updated',
                count: count,
                status: status
              });
              resolve(true);
            }
          });
        });
      }).catch(function (error) {
        reject(error);
      });
    } else {
      logger.log({
        level: 'error',
        message: 'Error getting collection'
      });
      reject(new Error({
        message: 'Error getting collection!'
      }));
    }
  });
};
/**
 * Gets the list of current files uploaded by the user.
 * @param {string} userId - The ID of the user requesting a file list.
 * @returns {Array<Object>} - An array of files.
 */


exports.updateFile = updateFile;

var getFilesList = function getFilesList(userId) {
  return new Promise(function (resolve, reject) {
    var collection = dbObject.collection("files_".concat(userId));
    var queryFilter = {};
    var projectionFilter = {
      binaryData: false
    };

    if (collection) {
      collection.find(queryFilter, {
        promoteLongs: false
      }).project(projectionFilter).toArray(function (queryError, result) {
        if (queryError) {
          logger.log({
            level: 'error',
            message: 'Error finding documents',
            queryError: queryError
          });
          reject(queryError);
        } else {
          logger.log({
            level: 'debug',
            message: 'Documents found',
            result: result
          });
          resolve(result);
        }
      });
    } else {
      logger.log({
        level: 'error',
        message: 'Error getting collection.'
      });
      reject(new Error({
        message: 'Error getting collection!'
      }));
    }
  });
};
/**
 * Retrieve sharing info for a given user and file.
 * @param {string} userId - The user the file belongs to.
 * @param {string} fileId - The file to retrieve sharing info for.
 * @returns {Promise} - A promise resolving the sharing information object.
 */


exports.getFilesList = getFilesList;

var getSharingInfo = function getSharingInfo(userId, fileId, version) {
  return new Promise(function (resolve, reject) {
    var collection = dbObject.collection('file_sharing');
    var queryFilter = {
      userId: userId,
      fileId: fileId,
      version: version
    };
    var projectionFilter = {};
    logger.log({
      level: 'debug',
      message: 'Filter for getting share info: ',
      queryFilter: queryFilter
    });

    if (collection) {
      collection.find(queryFilter, {
        promoteLongs: false
      }).project(projectionFilter).toArray(function (queryError, result) {
        if (queryError) {
          logger.log({
            level: 'error',
            message: 'Error finding documents',
            queryError: queryError
          });
          reject(queryError);
        } else {
          logger.log({
            level: 'debug',
            message: 'Documents found',
            result: result
          });
          resolve(result);
        }
      });
    } else {
      logger.log({
        level: 'error',
        message: 'Error getting collection.'
      });
      reject(new Error({
        message: 'Error getting collection!'
      }));
    }
  });
};
/**
 * Remove sharing info for a given file and user.
 * @param {string} userId - The user the file belongs to.
 * @param {string} fileId - The ID of the file for sharing to be removed.
 * @param {string} version - The target version of the file.
 * @param {'email' | 'link'} type - Which type of sharing to disable, email or link (Default: link)
 * @returns {Object} - The MongoDB result of the updateOne query.
 */


exports.getSharingInfo = getSharingInfo;

var clearSharingInfo = function clearSharingInfo(userId, fileId, version, type) {
  return new Promise(function (resolve, reject) {
    var collection = dbObject.collection('file_sharing');
    var filter = {
      userId: userId,
      fileId: fileId,
      version: version
    };
    var update = {};

    if (!type || type !== 'link' && type !== 'email') {
      type = 'link';
    }

    if (type === 'email') {
      update = {
        $unset: {
          emailLink: '',
          emails: ''
        }
      };
    } else if (type === 'link') {
      update = {
        $unset: {
          url: ''
        }
      };
    }

    if (collection) {
      collection.updateOne(filter, update, function (error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    } else {
      logger.log({
        level: 'error',
        message: 'Error getting collection.'
      });
      reject(new Error({
        message: 'Error getting collection!'
      }));
    }
  });
};
/**
 * Create a static link that users can navigate to for viewing your shared document.
 * @param {string} userId - The user who owns the file.
 * @param {string} fileId - The ID of the file to be shared.
 * @param {string} shareString - The string that should be used to create the share link.
 * @param {number} version - The target version of the file.
 * @returns {Promise} - A promise resolving the link if succeeded, error message if failed.
 */


exports.clearSharingInfo = clearSharingInfo;

var addShareLink = function addShareLink(user, fileId, shareString, version) {
  return new Promise(function (resolve, reject) {
    var collection = dbObject.collection('file_sharing');
    var filter = {
      fileId: fileId,
      userId: user._id
    };
    var update = {
      $set: {
        url: shareString
      }
    };
    var options = {};

    if (collection) {
      collection.findOne(filter, {
        promoteLongs: false
      }, function (findError, findResult) {
        if (findError) {
          logger.log({
            level: 'error',
            message: 'Error finding documents',
            findError: findError
          });
          reject(findError);
        } else if (findResult) {
          // Share document already exists, modify it.
          logger.log({
            level: 'debug',
            message: 'Result of find: ',
            findResult: findResult
          });
          collection.updateOne(filter, update, options, function (queryError, result) {
            if (queryError) {
              logger.log({
                level: 'error',
                message: 'Error finding documents',
                queryError: queryError
              });
              reject(queryError);
            } else {
              logger.log({
                level: 'debug',
                message: 'Documents Updated',
                result: result
              });
              resolve(result);
            }
          });
        } else {
          // Share document does not exist, create it.
          var insertDoc = {
            fileId: fileId,
            userId: user._id,
            author: user.email,
            url: shareString,
            version: version
          };
          collection.insertOne(insertDoc, function (insertError, insertResult) {
            if (insertError) {
              logger.log({
                level: 'error',
                message: 'Error finding documents',
                insertError: insertError
              });
              reject(insertError);
            } else {
              logger.log({
                level: 'debug',
                message: 'Documents Inserted',
                insertResult: insertResult
              });
              resolve(insertResult);
            }
          });
        }
      });
    } else {
      logger.log({
        level: 'error',
        message: 'Error getting collection.'
      });
      reject(new Error({
        message: 'Error getting collection!'
      }));
    }
  });
};
/**
 * Add or update a list of emails who can publicly access this file.
 * @param {Object} user - The user who owns the file.
 * @param {string} fileId - The ID of the file to be shared.
 * @param {Array<string>} emails - A list of emails that have access to the file.
 * @param {string} shareString - A generated string for sharing this file with users.
 * @param {number} version - The target version of the file.
 * @returns {Promise} - A promise resolving the link if succeeded, error message if failed.
 */


exports.addShareLink = addShareLink;

var addShareEmail = function addShareEmail(user, fileId, emails, shareString, version) {
  return new Promise(function (resolve, reject) {
    var collection = dbObject.collection('file_sharing');
    var filter = {
      fileId: fileId,
      userId: user._id
    };
    var update = {
      $set: {
        emails: emails
      }
    };
    var options = {};

    if (collection) {
      collection.findOne(filter, {
        promoteLongs: false
      }, function (findError, findResult) {
        if (findError) {
          logger.log({
            level: 'error',
            message: 'Error finding documents',
            findError: findError
          });
          reject(findError);
        } else if (findResult) {
          // Share document already exists, modify it.
          logger.log({
            level: 'debug',
            message: 'Result of find: ',
            findResult: findResult
          });

          if (!findResult.emailLink) {
            update = {
              $set: {
                emails: emails,
                emailLink: shareString
              }
            };
          }

          collection.updateOne(filter, update, options, function (queryError, result) {
            if (queryError) {
              logger.log({
                level: 'error',
                message: 'Error updating documents',
                queryError: queryError
              });
              reject(queryError);
            } else {
              logger.log({
                level: 'debug',
                message: 'Documents Updated',
                result: result
              });
              resolve(result);
            }
          });
        } else {
          // Share document does not exist, create it.
          collection.insertOne({
            fileId: fileId,
            userId: user._id,
            author: user.email,
            emails: emails,
            emailLink: shareString,
            version: version
          }, function (insertError, insertResult) {
            if (insertError) {
              logger.log({
                level: 'error',
                message: 'Error finding documents',
                insertError: insertError
              });
              reject(insertError);
            } else {
              logger.log({
                level: 'debug',
                message: 'Documents Inserted',
                insertResult: insertResult
              });
              resolve(insertResult);
            }
          });
        }
      });
    } else {
      logger.log({
        level: 'error',
        message: 'Error getting collection.'
      });
      reject(new Error({
        message: 'Error getting collection!'
      }));
    }
  });
};
/**
 * Given a shareString, fetch the file associated with that link.
 * @param {string} link - The link associated with a file for fetching.
 * @returns {Object} - The result of a findOne against that link.
 */


exports.addShareEmail = addShareEmail;

var getSharedFileFromLink = function getSharedFileFromLink(link) {
  return new Promise(function (resolve, reject) {
    var collection = dbObject.collection('file_sharing');
    var filter = {
      $or: [{
        url: link
      }, {
        emailLink: link
      }]
    };
    logger.log({
      level: 'debug',
      message: 'Query Filter for Find',
      filter: filter
    });

    if (collection) {
      collection.findOne(filter, {
        promoteLongs: false
      }, function (findError, findResult) {
        if (findError) {
          logger.log({
            level: 'error',
            message: 'Error finding shared file from link.'
          });
          reject(new Error({
            message: 'Error finding shared file from link'
          }));
        } else if (findResult) {
          logger.log({
            level: 'debug',
            message: 'Find result for share',
            findResult: findResult
          });
          resolve(findResult);
        } else {
          logger.log({
            level: 'error',
            message: 'No file found matching link.',
            findError: findError,
            findResult: findResult
          });
          reject(new Error({
            message: 'No file found matching link.'
          }));
        }
      });
    } else {
      logger.log({
        level: 'error',
        message: 'Error getting collection'
      });
      reject(new Error({
        message: 'Error getting collection!'
      }));
    }
  });
};
/**
 * Simple helper function for running the docHistory command.
 * @param {string} fileName - The name of the file to serach history for.
 * @param {string} userId - The userID of the file owner.
 * @returns {Promise} A promise resolving the document history, or rejecting an error.
 */


exports.getSharedFileFromLink = getSharedFileFromLink;

var getFileHistory = function getFileHistory(fileName, userId) {
  return new Promise(function (resolve, reject) {
    var collection = "files_".concat(userId);
    var filter = {
      name: fileName
    };
    var command = {
      docHistory: {
        collection: collection,
        filter: filter
      }
    };
    logger.log({
      level: 'debug',
      message: 'Query for finding history is',
      command: command
    });
    dbObject.command(command, function (error, result) {
      if (error) {
        logger.log({
          level: 'error',
          message: 'Failed to run command!',
          collection: collection,
          filter: filter,
          error: error
        });
        reject(error);
      } else {
        // Got file history, now for each file get proofStatus.
        var returnObject = result.docHistory[0];
        resolve({
          docHistory: returnObject
        });
      }
    });
  });
};
/**
 * Retrieves a file at a particular version.
 * @param {String | null} fileName - The name of the file to get a historical version for.
 * @param {String} userId - The ID of the user the file belongs to.
 * @param {Number} version - The version of the file.
 * @param {string | null} fileId - The ID of the file, will be used instead of fileName if provided.
 * @returns {Array<Object>} - Array of files fetched from MongoDB.
 */


exports.getFileHistory = getFileHistory;

var getHistoricalFile = function getHistoricalFile(fileName, userId, version, fileId) {
  return new Promise(function (resolve, reject) {
    logger.log({
      level: 'debug',
      message: 'Getting historical file',
      fileName: fileName,
      userId: userId,
      version: version,
      fileId: fileId
    });
    var collectionName = "files_".concat(userId);
    var filter = {};

    if (fileId) {
      filter = {
        _id: new mongo.ObjectId(fileId),
        '_provendb_metadata.minVersion': parseInt(version, 10)
      };
    } else {
      filter = {
        name: fileName,
        '_provendb_metadata.minVersion': parseInt(version, 10)
      };
    }

    logger.log({
      level: 'debug',
      message: 'Query for file history.',
      collectionName: collectionName,
      filter: filter
    });
    dbObject.command({
      showMetadata: true
    }, function (error) {
      if (error) {
        reject(error);
      } else {
        var collection = dbObject.collection(collectionName);

        if (collection) {
          collection.find(filter, {
            promoteLongs: false
          }).toArray(function (queryError, result) {
            if (queryError) {
              logger.log({
                level: 'error',
                message: 'Failed to query files for historical file',
                queryError: queryError
              });
              reject(queryError);
            } else if (result) {
              resolve(result);
            } else {
              logger.log({
                level: 'error',
                message: 'Found no matching files.',
                queryError: queryError
              });
              reject(new Error("Didn't find any file."));
            }
          });
        } else {
          reject(new Error('Couldnt get collection'));
        }
      }
    });
  });
};
/**
 * Gets the total size of all a users files.
 * @param {string} userId - The ID of the user to get total file size for.
 * @param {number} - The sum of the size of each file.
 */


exports.getHistoricalFile = getHistoricalFile;

var getTotalFilesSize = function getTotalFilesSize(userId) {
  return new Promise(function (resolve, reject) {
    var collection = dbObject.collection("files_".concat(userId));
    var queryFilter = {};
    var projectionFilter = {
      size: true
    };

    if (collection) {
      collection.find(queryFilter, {
        promoteLongs: false
      }).project(projectionFilter).toArray(function (queryError, result) {
        if (queryError) {
          logger.log({
            level: 'error',
            message: 'Error finding documents size',
            queryError: queryError
          });
          reject(queryError);
        } else if (result !== []) {
          var totalSize = 0;
          result.forEach(function (value, index) {
            totalSize += value.size;

            if (index === result.length - 1) {
              logger.log({
                level: 'debug',
                message: 'Documents size found',
                totalSize: totalSize
              });
              resolve(totalSize);
            }
          });
        } else {
          logger.log({
            level: 'debug',
            message: 'No files for size. ',
            result: result
          });
          resolve(0);
        }
      });
    } else {
      logger.log({
        level: 'error',
        message: 'Error getting collection.'
      });
      reject(new Error({
        message: 'Error getting collection!'
      }));
    }
  });
};
/**
 * Get information for a single file, including the metadata.
 * @param {string} fileId - The ID of the file to get information about.
 * @param {*} userId - The ID of the user who owns the file.
 * @param {*} isSecondTry - Is this the second time this has run? (For auto-retry)
 * @returns {Object} - The document from MongoDB including metadata.
 */


exports.getTotalFilesSize = getTotalFilesSize;

var getFileInformation = function getFileInformation(fileId, userId, isSecondTry) {
  return new Promise(function (resolve, reject) {
    var collection = dbObject.collection("files_".concat(userId));
    var queryFilter = {
      _id: new mongo.ObjectId(fileId)
    };
    var projectionFilter = {};

    if (collection) {
      dbObject.command({
        showMetadata: true
      }, function (error, metaDataResult) {
        if (error) {
          reject(error);
        } else {
          logger.log({
            level: 'debug',
            message: 'Query for getting file information',
            resultOfShowMetadata: metaDataResult,
            queryFilter: queryFilter,
            collectionName: "files_".concat(userId)
          });
          collection.find(queryFilter, {
            promoteLongs: false
          }).project(projectionFilter).limit(1).toArray(function (queryError, result) {
            if (queryError) {
              logger.log({
                level: 'error',
                message: 'Error finding documents',
                queryError: queryError
              });
              reject(queryError);
            } else if (result) {
              if (!result[0]._provendb_metadata) {
                var returnObject = {
                  level: 'error',
                  message: 'Proxy did not return any metadata :(',
                  result: result
                };
                logger.log(returnObject); // Try Once more.

                if (isSecondTry) {
                  var returnObjectAgain = {
                    level: 'error',
                    message: 'Proxy did not return any metadata AGAIN :(',
                    result: result
                  };
                  logger.log(returnObjectAgain);
                  reject(returnObjectAgain);
                } else {
                  // $FlowFixMe
                  getFileInformation(fileId, userId, true).then(function (res) {
                    resolve(res);
                  }).catch(function (err) {
                    reject(err);
                  });
                }
              } else {
                resolve(result);
              }
            } else {
              logger.log({
                level: 'debug',
                message: 'Could not find file matching',
                userId: userId,
                queryFilter: queryFilter
              });
              reject(result);
            }
          });
        }
      });
    } else {
      logger.log({
        level: 'error',
        message: 'Error getting collection',
        userId: userId
      });
      reject(new Error({
        message: 'Error getting collection!'
      }));
    }
  });
};

exports.getFileInformation = getFileInformation;

var createNewProof = function createNewProof() {
  return new Promise(function (resolve) {
    debouncedSubmitProof();
    resolve(true);
  });
};

exports.createNewProof = createNewProof;

var checkProofStatus = function checkProofStatus(version) {
  return new Promise(function (resolve, reject) {
    logger.log({
      level: 'debug',
      message: 'Checking proof status',
      version: version
    }); // Get proof for a version.

    dbObject.command({
      getProof: version
    }, function (getProofError, getProofResult) {
      if (getProofError) {
        logger.log({
          level: 'error',
          message: 'Error getting proof',
          getProofError: getProofError
        });
        reject(new Error({
          message: 'Error getting proof: ',
          getProofError: getProofError
        }));
      } else {
        logger.log({
          level: 'info',
          message: 'Proof Status for version',
          version: version,
          status: getProofResult
        });
        logger.log({
          level: 'debug',
          message: 'Got File History.',
          getProofResult: getProofResult
        });
        resolve(getProofResult);
      }
    });
  });
};

exports.checkProofStatus = checkProofStatus;

var showMetadata = function showMetadata() {
  return new Promise(function (resolve, reject) {
    dbObject.command({
      showMetadata: true
    }, function (showMDErr, res) {
      if (showMDErr || !res || res.ok !== 1) {
        logger.log({
          level: 'error',
          message: 'Error showing metadata',
          showMDErr: showMDErr
        });
        reject(showMDErr);
      } else {
        logger.log({
          level: 'debug',
          message: 'Show metadata result',
          res: res
        });
        resolve(res);
      }
    });
  });
};

exports.showMetadata = showMetadata;

var getVersionProofForFile = function getVersionProofForFile(fileInfo, getJSON, proofID) {
  return new Promise(function (resolve, reject) {
    var minVersion = fileInfo._provendb_metadata.minVersion;
    logger.log({
      level: 'debug',
      message: 'Fetching proof information for file: ',
      fileName: fileInfo.name,
      minVersion: minVersion
    });
    var format = 'binary';

    if (getJSON === true) {
      format = 'json';
    }

    dbObject.command({
      getProof: proofID,
      format: format
    }, function (getProofError, getProofResult) {
      if (getProofError) {
        logger.log({
          level: 'error',
          message: 'Error getting proof',
          getProofError: getProofError
        });
        reject(new Error({
          message: 'Error getting proof: ',
          getProofError: getProofError
        }));
      } else {
        logger.log({
          level: 'debug',
          message: 'Version proof Status for file',
          fileName: fileInfo.name,
          minVersion: minVersion,
          status: getProofResult
        });
        resolve(getProofResult);
      }
    });
  });
};

exports.getVersionProofForFile = getVersionProofForFile;

var getDocumentProofForFile = function getDocumentProofForFile(fileInfo, userId) {
  var format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'binary';
  return new Promise(function (resolve, reject) {
    var minVersion = fileInfo._provendb_metadata.minVersion;
    var name = fileInfo.name;
    logger.log({
      level: 'debug',
      message: 'Fetching document proof information for file: ',
      name: name,
      minVersion: minVersion,
      userId: userId
    }); // Get proof for a version.

    logger.log({
      level: 'info',
      message: 'Query for getDocument Proof:',
      query: {
        getDocumentProof: {
          collection: "files_".concat(userId),
          filter: {
            name: name
          },
          version: minVersion,
          format: 'binary'
        }
      }
    }); // @TODO -> Make this debug.

    dbObject.command({
      getDocumentProof: {
        collection: "files_".concat(userId),
        filter: {
          name: name
        },
        version: minVersion,
        format: format
      }
    }, function (getProofError, getProofResult) {
      if (getProofError) {
        logger.log({
          level: 'error',
          message: 'Error getting proof',
          getProofError: getProofError
        });
        reject(new Error({
          message: 'Error getting proof: ',
          getProofError: getProofError
        }));
      } else {
        logger.log({
          level: 'debug',
          message: 'Proof Status for document',
          minVersion: minVersion,
          status: getProofResult
        });
        resolve(getProofResult);
      }
    });
  });
};

exports.getDocumentProofForFile = getDocumentProofForFile;
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(logger, "logger", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/mongoAPI.js");
  reactHotLoader.register(splitURI, "splitURI", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/mongoAPI.js");
  reactHotLoader.register(provendocsDB, "provendocsDB", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/mongoAPI.js");
  reactHotLoader.register(dbObject, "dbObject", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/mongoAPI.js");
  reactHotLoader.register(debouncedSubmitProof, "debouncedSubmitProof", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/mongoAPI.js");
  reactHotLoader.register(checkForDuplicates, "checkForDuplicates", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/mongoAPI.js");
  reactHotLoader.register(concatDocs, "concatDocs", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/mongoAPI.js");
  reactHotLoader.register(uploadFile, "uploadFile", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/mongoAPI.js");
  reactHotLoader.register(uploadEmail, "uploadEmail", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/mongoAPI.js");
  reactHotLoader.register(uploadAttachments, "uploadAttachments", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/mongoAPI.js");
  reactHotLoader.register(updateFile, "updateFile", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/mongoAPI.js");
  reactHotLoader.register(getFilesList, "getFilesList", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/mongoAPI.js");
  reactHotLoader.register(getSharingInfo, "getSharingInfo", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/mongoAPI.js");
  reactHotLoader.register(clearSharingInfo, "clearSharingInfo", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/mongoAPI.js");
  reactHotLoader.register(addShareLink, "addShareLink", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/mongoAPI.js");
  reactHotLoader.register(addShareEmail, "addShareEmail", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/mongoAPI.js");
  reactHotLoader.register(getSharedFileFromLink, "getSharedFileFromLink", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/mongoAPI.js");
  reactHotLoader.register(getFileHistory, "getFileHistory", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/mongoAPI.js");
  reactHotLoader.register(getHistoricalFile, "getHistoricalFile", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/mongoAPI.js");
  reactHotLoader.register(getTotalFilesSize, "getTotalFilesSize", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/mongoAPI.js");
  reactHotLoader.register(getFileInformation, "getFileInformation", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/mongoAPI.js");
  reactHotLoader.register(createNewProof, "createNewProof", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/mongoAPI.js");
  reactHotLoader.register(checkProofStatus, "checkProofStatus", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/mongoAPI.js");
  reactHotLoader.register(showMetadata, "showMetadata", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/mongoAPI.js");
  reactHotLoader.register(getVersionProofForFile, "getVersionProofForFile", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/mongoAPI.js");
  reactHotLoader.register(getDocumentProofForFile, "getDocumentProofForFile", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/mongoAPI.js");
  leaveModule(module);
})();

;