"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateNewFileName = exports.reduceFileToPreview = exports.styleFilePreview = exports.convertFileToHTML = exports.decodeFile = exports.convertToBinary = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _lodash = _interopRequireDefault(require("lodash"));

var _winston = _interopRequireDefault(require("winston"));

var _path = _interopRequireDefault(require("path"));

var _xlsx = _interopRequireDefault(require("xlsx"));

var _base64Img = _interopRequireDefault(require("base64-img"));

var _base64topdf = _interopRequireDefault(require("base64topdf"));

var _file2htmlText = _interopRequireDefault(require("file2html-text"));

var _file2htmlOoxml = _interopRequireDefault(require("file2html-ooxml"));

var _file2htmlImage = _interopRequireDefault(require("file2html-image"));

var file2html = _interopRequireWildcard(require("file2html"));

var _constants = require("../common/constants.js");

var _winstonConfig = require("../modules/winston.config.js");

var _emailHelpers = require("./emailHelpers.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

var mammoth = require('mammoth');

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

var convertToBinary = function convertToBinary(files) {
  return new Promise(function (resolve, reject) {
    // For each file:
    var binaryFiles = [];
    logger.log({
      level: _constants.DEBUG_LEVELS.DEBUG,
      message: 'Converting files to binary',
      files: files
    });

    _lodash.default.forEach(files, function (file) {
      if (file.originalname.endsWith('.xlsx')) {
        file.mimetype = _constants.MIMETYPES.XLSX;
      }

      var path = file.path,
          originalname = file.originalname,
          mimetype = file.mimetype,
          encoding = file.encoding;
      logger.log({
        level: 'debug',
        message: 'Converting file to binary',
        path: path,
        mimetype: mimetype,
        encoding: encoding,
        originalname: originalname
      });

      if (mimetype === _constants.MIMETYPES.PDF) {
        var encodedFile = _base64topdf.default.base64Encode(path);

        binaryFiles.push({
          file: file,
          encodedFile: encodedFile
        }); // eslint-disable-next-line

        if (binaryFiles.length == files.length) {
          resolve(binaryFiles);
        }
      } else if (mimetype === _constants.MIMETYPES.DOCX || mimetype === _constants.MIMETYPES.XLSX) {
        _fs.default.readFile(path, function (err, data) {
          if (err) {
            logger.log({
              code: _constants.ERROR_CODES.FAILED_TO_READ_FILE,
              level: 'error',
              message: 'Error reading file.',
              err: err
            });
            reject(err);
          } else {
            // eslint-disable-next-line
            var _encodedFile = data.toString('base64');

            binaryFiles.push({
              file: file,
              encodedFile: _encodedFile
            }); // eslint-disable-next-line

            if (binaryFiles.length == files.length) {
              resolve(binaryFiles);
            }
          }
        });
      } else {
        _fs.default.readFile(path, function (err, data) {
          if (err) {
            logger.log({
              code: _constants.ERROR_CODES.FAILED_TO_READ_FILE,
              level: 'error',
              message: 'Error reading file.',
              err: err
            });
            reject(err);
          } else {
            // eslint-disable-next-line
            var _encodedFile2 = new Buffer(data).toString('base64');

            if (mimetype === _constants.MIMETYPES.PNG) {
              _encodedFile2 = "data:image/png;base64,".concat(_encodedFile2);
            }

            binaryFiles.push({
              file: file,
              encodedFile: _encodedFile2
            }); // eslint-disable-next-line

            if (binaryFiles.length == files.length) {
              resolve(binaryFiles);
            }
          }
        });
      }
    });
  });
};
/**
 * Takes a file and decodes its
 * @param {Object} file - The file object including the binaryData.
 * @returns {String} Either the path of the file if written out, or the file data itself.
 */


exports.convertToBinary = convertToBinary;

var decodeFile = function decodeFile(file) {
  return new Promise(function (resolve, reject) {
    // If file already exists, just return that file path
    var path = _path.default.join(__dirname, "uploads/".concat(file.name));

    var name = file.name,
        binaryData = file.binaryData;
    var encoding = file.encoding; // eslint-disable-next-line

    switch (file.mimetype) {
      case _constants.MIMETYPES.PNG:
      case _constants.MIMETYPES.JPEG:
        logger.log({
          level: 'debug',
          message: 'Decoding Image',
          fileName: file.name,
          mimetype: file.mimetype,
          binaryData: binaryData
        });

        _base64Img.default.img(file.binaryData, _path.default.join(__dirname, 'uploads'), file.name.slice(0, file.name.length - 4), function (err) {
          if (err) {
            logger.log({
              level: 'error',
              message: 'Failed to write file out.',
              err: err
            });
            reject(err);
          } else {
            logger.log({
              level: 'debug',
              message: 'Wrote file out',
              path: path
            });
            resolve(path);
          }
        });

        break;

      case _constants.MIMETYPES.PDF:
        logger.log({
          level: 'debug',
          message: 'Decoding PDF',
          name: name
        });

        var decodedData = _base64topdf.default.base64Decode(file.binaryData, "decoded_".concat(name));

        logger.log({
          level: 'debug',
          message: 'Decoded',
          decodedData: decodedData
        });
        resolve("decoded_".concat(name));
        break;

      case _constants.MIMETYPES.EMAIL:
        if (encoding === '7bit') {
          encoding = 'ascii';
        } // eslint-disable-next-line


        resolve(JSON.parse(new Buffer(binaryData, 'base64').toString(encoding)));
        break;

      case _constants.MIMETYPES.DOCX:
        // eslint-disable-next-line
        var decodedDocX = Buffer.from(binaryData, 'base64');

        _fs.default.writeFile(path, decodedDocX, function (err) {
          if (err) {
            logger.log({
              code: _constants.ERROR_CODES.FAILED_TO_WRITE_FILE,
              level: 'error',
              message: 'Failed to write out file',
              err: err
            });
            reject(err);
          } else {
            logger.log({
              level: 'debug',
              message: 'Wrote file out',
              path: path
            });
            resolve(path);
          }
        });

        break;

      case _constants.MIMETYPES.XLSX:
        // eslint-disable-next-line
        var decodedString = Buffer.from(binaryData, 'base64');

        _fs.default.writeFile(path, decodedString, function (err) {
          if (err) {
            logger.log({
              code: _constants.ERROR_CODES.FAILED_TO_WRITE_FILE,
              level: 'error',
              message: 'Failed to write out file',
              err: err
            });
            reject(err);
          } else {
            logger.log({
              level: 'debug',
              message: 'Wrote file out',
              path: path
            });
            resolve(path);
          }
        });

        break;

      default:
        logger.log({
          level: 'debug',
          message: 'Decoding file',
          name: name
        }); // eslint-disable-next-line

        var originalData = new Buffer(binaryData, 'base64');

        if (encoding === '7bit') {
          encoding = 'ascii';
        }

        _fs.default.writeFile(path, originalData.toString(encoding), function (err) {
          if (err) {
            logger.log({
              code: _constants.ERROR_CODES.FAILED_TO_WRITE_FILE,
              level: 'error',
              message: 'Failed to write out file',
              err: err
            });
            reject(err);
          } else {
            logger.log({
              level: 'debug',
              message: 'Wrote file out',
              path: path
            });
            resolve(path);
          }
        });

        break;
    }
  });
};
/**
 * Reads in a file and creates a HTML representation of that file.
 * NOTE: For PDF files, nothing is created, as modern browsers can render PDFs natively.
 * @param {string} path - The path to the file.
 * @param {Object} fileInfo - Metadata about the file needed for conversion.
 * @returns {Object} - An object containing html, and associated style information.
 */


exports.decodeFile = decodeFile;

var convertFileToHTML = function convertFileToHTML(path, fileInfo) {
  return new Promise(function (resolve, reject) {
    if (fileInfo.mimetype === _constants.MIMETYPES.EMAIL) {
      (0, _emailHelpers.convertEmailToHTML)(path).then(function (result) {
        var to = path.to,
            from = path.from,
            subject = path.subject,
            cc = path.cc,
            attachments = path.attachments;
        logger.log({
          level: 'debug',
          message: 'Result of email HTML search',
          result: result
        });
        resolve({
          content: result,
          styles: {},
          to: to,
          from: from,
          subject: subject,
          cc: cc,
          attachments: attachments
        });
      }).catch(function (convertToHTMLErr) {
        reject(convertToHTMLErr);
      });
    } else {
      _fs.default.readFile(path, function (err, buffer) {
        if (err) {
          logger.log({
            level: 'error',
            message: 'Error reading file',
            err: err
          });
          reject(err);
        } else {
          logger.log({
            level: 'info',
            message: 'File was read in',
            fileName: fileInfo.name,
            mimetype: fileInfo.mimetype
          });

          switch (fileInfo.mimetype) {
            case _constants.MIMETYPES.TEXT:
              fileInfo.mimeType = 'text/plain';
              file2html.read({
                fileBuffer: buffer,
                meta: fileInfo
              }).then(function (fileHTML) {
                var _fileHTML$getData = fileHTML.getData(),
                    styles = _fileHTML$getData.styles,
                    content = _fileHTML$getData.content;

                resolve({
                  styles: styles,
                  content: content
                });
              }).catch(function (file2htmlError) {
                logger.log({
                  level: 'error',
                  message: 'Failed to convert file to html',
                  fileName: fileInfo.name,
                  mimetype: fileInfo.mimetype
                });
                reject(file2htmlError);
              });
              break;

            case _constants.MIMETYPES.JSON:
              // @TODO -> Reduce text file length.
              fileInfo.mimeType = 'text/plain';
              file2html.read({
                fileBuffer: buffer,
                meta: fileInfo
              }).then(function (fileHTML) {
                var _fileHTML$getData2 = fileHTML.getData(),
                    styles = _fileHTML$getData2.styles,
                    content = _fileHTML$getData2.content;

                resolve({
                  styles: styles,
                  content: content
                });
              }).catch(function (file2htmlError) {
                logger.log({
                  level: 'error',
                  message: 'Failed to convert file to html',
                  fileName: fileInfo.name,
                  mimetype: fileInfo.mimetype
                });
                reject(file2htmlError);
              });
              break;

            case _constants.MIMETYPES.OCTET_STREAM:
              // @TODO -> Reduce text file length.
              fileInfo.mimeType = 'text/plain';
              file2html.read({
                fileBuffer: buffer,
                meta: fileInfo
              }).then(function (fileHTML) {
                var _fileHTML$getData3 = fileHTML.getData(),
                    styles = _fileHTML$getData3.styles,
                    content = _fileHTML$getData3.content;

                resolve({
                  styles: styles,
                  content: content
                });
              }).catch(function (file2htmlError) {
                logger.log({
                  level: 'error',
                  message: 'Failed to convert file to html',
                  fileName: fileInfo.name,
                  mimetype: fileInfo.mimetype
                });
                reject(file2htmlError);
              });
              break;

            case _constants.MIMETYPES.PNG:
              logger.log({
                level: 'debug',
                message: 'Converting PNG'
              });
              fileInfo.mimeType = 'image/png';
              file2html.read({
                fileBuffer: buffer,
                meta: fileInfo
              }).then(function (fileHTML) {
                var _fileHTML$getData4 = fileHTML.getData(),
                    styles = _fileHTML$getData4.styles,
                    content = _fileHTML$getData4.content;

                resolve({
                  styles: styles,
                  content: content
                });
              }).catch(function (file2htmlError) {
                logger.log({
                  level: 'error',
                  message: 'Failed to convert file to html',
                  fileName: fileInfo.name,
                  mimetype: fileInfo.mimetype
                });
                reject(file2htmlError);
              });
              break;

            case _constants.MIMETYPES.SVG:
              // @TODO -> Reduce text file length.
              fileInfo.mimeType = 'image/svg+xml';
              file2html.read({
                fileBuffer: buffer,
                meta: fileInfo
              }).then(function (fileHTML) {
                var _fileHTML$getData5 = fileHTML.getData(),
                    styles = _fileHTML$getData5.styles,
                    content = _fileHTML$getData5.content;

                resolve({
                  styles: styles,
                  content: content
                });
              }).catch(function (file2htmlError) {
                logger.log({
                  level: 'error',
                  message: 'Failed to convert file to html',
                  fileName: fileInfo.name,
                  mimetype: fileInfo.mimetype
                });
                reject(file2htmlError);
              });
              break;

            case _constants.MIMETYPES.JPEG:
              logger.log({
                level: 'debug',
                message: 'Converting JPEG'
              });
              fileInfo.mimeType = 'image/jpg';
              file2html.read({
                fileBuffer: buffer,
                meta: fileInfo
              }).then(function (fileHTML) {
                var _fileHTML$getData6 = fileHTML.getData(),
                    styles = _fileHTML$getData6.styles,
                    content = _fileHTML$getData6.content;

                resolve({
                  styles: styles,
                  content: content
                });
              }).catch(function (file2htmlError) {
                logger.log({
                  level: _constants.DEBUG_LEVELS.ERROR,
                  message: 'Failed to convert file to html',
                  fileName: fileInfo.name,
                  mimetype: fileInfo.mimetype
                });
                reject(file2htmlError);
              });
              break;

            case _constants.MIMETYPES.DOCX:
              mammoth.convertToHtml({
                path: path
              }).then(function (result) {
                var value = result.value,
                    messages = result.messages;
                logger.log({
                  level: _constants.DEBUG_LEVELS.DEBUG,
                  message: 'Converted DocX to HTML.',
                  mammothMessages: messages
                });
                resolve({
                  content: value,
                  style: {}
                });
              }).catch(function (mammothErr) {
                logger.log({
                  code: _constants.ERROR_CODES.MAMMOTH_DOCX_2_HTML_ERROR,
                  level: _constants.DEBUG_LEVELS.ERROR,
                  message: 'Failed to convert DocX to HTML (with Mammoth)',
                  mammothErr: mammothErr
                });
                reject(mammothErr);
              }).done();
              break;

            case _constants.MIMETYPES.XLSX:
              // eslint-disable-line
              var workbook = _xlsx.default.readFile(path);

              resolve({
                content: workbook,
                style: {}
              });
              break;

            case _constants.MIMETYPES.PDF:
              // Just return nothing, so proof info is still returned.
              resolve({
                styles: {},
                content: {}
              });
              break;

            default:
              logger.log({
                level: 'error',
                message: 'No valid type found for file',
                fileName: fileInfo.name,
                mimetype: fileInfo.mimetype
              });
              resolve({
                styles: {},
                content: {}
              });
              reject();
              break;
          }
        }
      });
    }
  });
};
/**
 * Adds any required custom styles to a HTML preview of a document.
 * @param {*} style - Takes in any initial styles generated with the HTML preview.
 * @param {*} type - Type of file dictates extra styling.
 * @returns {Object} - A styles object to apply to the html.
 */


exports.convertFileToHTML = convertFileToHTML;

var styleFilePreview = function styleFilePreview(style, type) {
  return new Promise(function (resolve) {
    logger.log({
      level: 'debug',
      message: 'Styling preview of type',
      type: type
    });

    switch (type) {
      case 'text/plain':
        resolve({
          'font-size': '4px'
        });
        return;

      default:
        resolve({});
    }
  });
};
/**
 * Takes in a html preview of a file, and reduces it to a smaller form.
 * @param {Object} fileHTML - The previously generated HTML version of the file.
 * @param {Object} fileType - The mimetype of the file.
 * @returns {Object} - The HTML in a reduced form.
 */


exports.styleFilePreview = styleFilePreview;

var reduceFileToPreview = function reduceFileToPreview(fileHTML, fileType) {
  return new Promise(function (resolve, reject) {
    switch (fileType) {
      case _constants.MIMETYPES.TEXT:
        // Remove possible HTML and shorten text.
        logger.log({
          level: 'debug',
          message: 'Shortening Text File...',
          fileType: fileType,
          fileHTML: fileHTML
        });
        fileHTML.content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        fileHTML.content = fileHTML.content.substring(0, 650);
        logger.log({
          level: 'debug',
          message: 'Text file shortened.',
          fileType: fileType,
          fileHTML: fileHTML
        });
        styleFilePreview(fileHTML.styles, fileType).then(function (newStyles) {
          logger.log({
            level: 'debug',
            message: 'Styled File Preview!',
            fileType: fileType,
            fileHTML: fileHTML
          });
          fileHTML.styles = newStyles;
          logger.log({
            level: 'debug',
            message: 'Resolving...',
            fileType: fileType,
            fileHTML: fileHTML
          });
          resolve(fileHTML);
        }).catch(function (err) {
          logger.log({
            level: 'error',
            message: 'Failed to style preview',
            fileType: fileType
          });
          reject(err);
        });
        break;

      case _constants.MIMETYPES.PDF:
        logger.log({
          level: 'debug',
          message: 'PDFs do not require reduction.',
          fileType: fileType
        });
        resolve({});
        break;

      case _constants.MIMETYPES.EMAIL:
        logger.log({
          level: _constants.DEBUG_LEVELS.DEBUG,
          message: 'Reducing email',
          fileHTML: fileHTML
        });
        resolve(fileHTML);
        break;

      default:
        resolve(fileHTML);
        break;
    }
  });
};
/**
 * Simple method for taking a file name and generating a new file name that will not cause duplication problems.
 * @TODO -> Method currently acts as a place holder which simply appends the date rather than a (1) pattern (preferred).
 * @param {string} originalFileName - The original name of the duplicate file.
 * @param {string} fileType - The file type ( for sanity checking ).
 * @returns {string} The original file name
 */


exports.reduceFileToPreview = reduceFileToPreview;

var generateNewFileName = function generateNewFileName(originalFileName, fileType) {
  return new Promise(function (resolve, reject) {
    var newFileName = originalFileName;

    if (!_lodash.default.includes(_constants.SUPPORTED_FILE_TYPES, fileType)) {
      reject();
    } else {
      // First, remove the extension.
      newFileName = _lodash.default.split(newFileName, '.'); // Secondly, append the date as the unique number on the end.

      var date = Date.now();
      newFileName[0] = newFileName[0].concat("_".concat(date.toString()));
      resolve(newFileName.join('.'));
    }
  });
};

exports.generateNewFileName = generateNewFileName;
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(logger, "logger", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/fileHelpers.js");
  reactHotLoader.register(convertToBinary, "convertToBinary", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/fileHelpers.js");
  reactHotLoader.register(decodeFile, "decodeFile", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/fileHelpers.js");
  reactHotLoader.register(convertFileToHTML, "convertFileToHTML", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/fileHelpers.js");
  reactHotLoader.register(styleFilePreview, "styleFilePreview", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/fileHelpers.js");
  reactHotLoader.register(reduceFileToPreview, "reduceFileToPreview", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/fileHelpers.js");
  reactHotLoader.register(generateNewFileName, "generateNewFileName", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/fileHelpers.js");
  leaveModule(module);
})();

;