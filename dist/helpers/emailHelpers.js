"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEmailDocument = exports.convertEmailToBinary = exports.convertEmailToHTML = exports.extractMetadata = exports.extractAttachments = exports.extractHTML = void 0;

var _winston = _interopRequireDefault(require("winston"));

var _file2htmlText = _interopRequireDefault(require("file2html-text"));

var _file2htmlOoxml = _interopRequireDefault(require("file2html-ooxml"));

var _file2htmlImage = _interopRequireDefault(require("file2html-image"));

var file2html = _interopRequireWildcard(require("file2html"));

var _objectSizeof = _interopRequireDefault(require("object-sizeof"));

var _winstonConfig = require("../modules/winston.config.js");

var _constants = require("../common/constants.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

file2html.config({
  readers: [_file2htmlText.default, _file2htmlOoxml.default, _file2htmlImage.default]
});

var logger = _winston.default.createLogger({
  transports: [new _winston.default.transports.Console({
    level: process.env.PROVENDOCS_LOG_LEVEL || 'debug',
    json: true,
    colorize: true,
    format: _winstonConfig.fileAPIFormat
  })]
});
/**
 * Extract the raw html from the email document and add it as an attribute.
 * @param {Object} document - An object containing the raw email and added fields.
 * @returns {Object} The document with the html attribute added.
 */


var extractHTML = function extractHTML(document) {
  return new Promise(function (resolve, reject) {
    try {
      logger.log({
        level: 'debug',
        message: 'Extracting HTML from email.',
        document: document
      });
      var email = document.email; // First, break the email into segments by content type:

      var splitEmail = email.split(/\n\n--/g); // const emailMetadata = splitEmail[0]; // First entry contains recieved etc...
      // Now iterate through each entry, checking disposition and content type.

      var html = false;
      splitEmail.forEach(function (value, emailIndex) {
        // We are only interested in inline or attachment content.
        if (value.match(/Content-Disposition: inline/)) {
          // We are only interested in the HTML representation.
          if (value.match(/Content-Type: text\/html/)) {
            logger.log({
              level: 'debug',
              message: 'Found HTML entry.',
              value: value
            });
            var splitHTML = value.split(/\n/g);
            splitHTML.forEach(function (htmlValue, index) {
              // Capture all the lines from <html to the end.
              if (htmlValue.match(/<html/)) {
                html = true;
                document.html = splitHTML.slice(index, splitHTML.length).join('\n');
                resolve(document); // eslint-disable-next-line

                return;
              }
            });
          }
        } else if (value.match(/Content-Disposition: attachment/)) {// @TODO -> Handling for attachments.
        }

        if (emailIndex === splitEmail.length && !html) {
          // If we haven't found html by now, reject.
          reject(new Error('Unable to find HTML in email.'));
        }
      });
      resolve(document);
    } catch (e) {
      reject(e);
    }
  });
};
/**
 * Extract a list of attachments from the email document and add them in a formatted array.
 * @param {Object} document - An object containing the raw email and added fields.
 * @returns {Object} The document with the attachment array added.
 */


exports.extractHTML = extractHTML;

var extractAttachments = function extractAttachments(document) {
  return new Promise(function (resolve, reject) {
    try {
      logger.log({
        level: 'info',
        message: 'Extracting Attachments from email.',
        document: document
      });
      var email = document.email;
      document.attachments = []; // First, get everything AFTER the html segment.

      var postHTML = email.split('Content-Type: text/html')[1];
      var splitEmail = postHTML.split(/--/g);

      if (splitEmail.length === 0) {
        resolve(document);
      } else {
        // Now iterate through each entry, checking disposition and content type.
        splitEmail.forEach(function (value, emailIndex) {
          // We are only interested in sections with content types.
          if (value.match(/Content-Type/g)) {
            logger.log({
              level: 'debug',
              message: 'Found an attachment: ',
              value: value
            }); // Split attachment by line.

            var splitValue = value.split('\n\n');
            logger.log({
              level: 'debug',
              message: 'Split by double line breaks: ',
              splitValue: splitValue
            }); // Extract metadata values.

            var metadata = splitValue[0].split('\n');
            logger.log({
              level: 'debug',
              message: 'Metadata: ',
              metadata: metadata
            });
            var binaryData = splitValue[1].replace(/\n/g, '');
            logger.log({
              level: 'debug',
              message: 'Binary Data: ',
              binaryData: binaryData
            }); // Fix up Mimetypes:

            var mimetype = metadata[1].split(': ')[1];

            if (mimetype === _constants.MIMETYPES.OCTET_STREAM) {
              mimetype = _constants.MIMETYPES.PDF;
            } // Fix up Encoding:


            var encoding = metadata[2].split(': ')[1];

            if (encoding === 'base64') {
              encoding = '7bit';
            } // Get Name Out:


            var name = "UNKNOWN_".concat(Date.now());

            for (var i = 0; i < metadata.length; i += 1) {
              if (metadata[i].match('filename')) {
                name = metadata[i].split('="')[1].slice(0, -1);
              }
            }

            logger.log({
              level: 'debug',
              message: 'Creating Attachemnt Document... ',
              mimetype: mimetype,
              encoding: encoding,
              metadata: metadata,
              name: name
            });
            var newAttachment = {
              mimetype: mimetype,
              encoding: encoding,
              name: name,
              size: (0, _objectSizeof.default)(binaryData),
              binaryData: binaryData
            };
            logger.log({
              level: 'debug',
              message: 'Attachment document: ',
              newAttachment: newAttachment
            });
            document.attachments.push(newAttachment);
          }

          if (emailIndex === splitEmail.length - 1) {
            resolve(document);
          }
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
/**
 * Extract a list of metadata fields from the email document and add them in a formatted object.
 * @param {Object} document - An object containing the raw email and added fields.
 * @returns {Object} The document with the metadata object added.
 */


exports.extractAttachments = extractAttachments;

var extractMetadata = function extractMetadata(document) {
  return new Promise(function (resolve, reject) {
    try {
      logger.log({
        level: 'debug',
        message: 'Extracting Metadata from email.',
        document: document
      });
      document.metadata = {
        date: 'Example Date',
        received: 'Example received'
      };
      resolve(document);
    } catch (e) {
      reject(e);
    }
  });
};
/**
 * Create a HTML version of an email for displaying.
 * @param {string} email - The text representation of the raw email.
 * @returns {string} A HTML representation of the email for displaying.
 */


exports.extractMetadata = extractMetadata;

var convertEmailToHTML = function convertEmailToHTML(emailDoc) {
  return new Promise(function (resolve, reject) {
    // @TODO -> Convert email to html.
    var email = emailDoc.email;
    logger.log({
      level: 'debug',
      message: 'Converting email to html.',
      email: email
    }); // First, break the email into segments by content type:

    var splitEmail = email.split(/\n\n--/g); // const emailMetadata = splitEmail[0]; // First entry contains recieved etc...
    // Now iterate through each entry, checking disposition and content type.

    var html = false;
    splitEmail.forEach(function (value, emailIndex) {
      logger.log({
        level: 'debug',
        message: 'Analysing Email Section...',
        value: value
      }); // We are only interested in the HTML representation.

      if (value.match(/Content-Type: text\/html/)) {
        logger.log({
          level: 'info',
          message: 'Found HTML entry.',
          value: value
        });
        var splitHTML = value.split(/\n/g);
        splitHTML.forEach(function (htmlValue, index) {
          // Capture all the lines from <html to the end.
          if (htmlValue.match(/<html/g)) {
            html = true;
            resolve(splitHTML.slice(index, splitHTML.length).join('\n')); // eslint-disable-next-line

            return;
          } // No HTML tag, search for first div tag?


          if (htmlValue.match(/<div/g)) {
            html = true;
            resolve(splitHTML.slice(index, splitHTML.length).join('\n')); // eslint-disable-next-line

            return;
          }
        });
      }

      if (emailIndex === splitEmail.length && !html) {
        // If we haven't found html by now, reject.
        reject(new Error('Unable to find HTML in email.'));
      }
    });
    reject(new Error(''));
  });
};
/**
 * Take an email in raw format and convert to a binary format.
 * @param {*} document - An object with the email and it's metadata.
 * @returns {Object} Object with binaryData field added.
 */


exports.convertEmailToHTML = convertEmailToHTML;

var convertEmailToBinary = function convertEmailToBinary(document) {
  return new Promise(function (resolve, reject) {
    try {
      logger.log({
        level: 'debug',
        message: 'Converting email to binary',
        document: document
      }); // eslint-disable-next-line

      document.binaryData = new Buffer(JSON.stringify(document)).toString('base64');
      resolve(document);
    } catch (e) {
      reject(e);
    }
  });
};
/**
 * Take a document object and add some mandetory fields so it can be inserted into MongoDB.
 * @param {*} document - The initial object containing email information.
 * @returns {Object} Object ready to be put into MongoDB.
 */


exports.convertEmailToBinary = convertEmailToBinary;

var createEmailDocument = function createEmailDocument(document) {
  return new Promise(function (resolve, reject) {
    try {
      logger.log({
        level: 'debug',
        message: 'Creating document for email',
        document: document
      });
      var binaryData = document.binaryData,
          subject = document.subject;
      var now = new Date(Date.now()).toISOString();
      var size = (0, _objectSizeof.default)(binaryData);
      resolve({
        name: "".concat(subject, "_").concat(now),
        mimetype: 'email',
        encoding: '7bit',
        binaryData: binaryData,
        size: size,
        uploadedAt: now,
        tags: [''],
        comment: ''
      });
    } catch (e) {
      reject(e);
    }
  });
};

exports.createEmailDocument = createEmailDocument;
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(logger, "logger", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/emailHelpers.js");
  reactHotLoader.register(extractHTML, "extractHTML", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/emailHelpers.js");
  reactHotLoader.register(extractAttachments, "extractAttachments", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/emailHelpers.js");
  reactHotLoader.register(extractMetadata, "extractMetadata", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/emailHelpers.js");
  reactHotLoader.register(convertEmailToHTML, "convertEmailToHTML", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/emailHelpers.js");
  reactHotLoader.register(convertEmailToBinary, "convertEmailToBinary", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/emailHelpers.js");
  reactHotLoader.register(createEmailDocument, "createEmailDocument", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/emailHelpers.js");
  leaveModule(module);
})();

;