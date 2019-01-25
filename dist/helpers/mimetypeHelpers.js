"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.placeholder = exports.fixBinaryData = void 0;

var _winston = _interopRequireDefault(require("winston"));

var _file2htmlText = _interopRequireDefault(require("file2html-text"));

var _file2htmlOoxml = _interopRequireDefault(require("file2html-ooxml"));

var _file2htmlImage = _interopRequireDefault(require("file2html-image"));

var file2html = _interopRequireWildcard(require("file2html"));

var _constants = require("../common/constants.js");

var _winstonConfig = require("../modules/winston.config.js");

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

var fixBinaryData = function fixBinaryData(binaryData, mimetype) {
  return new Promise(function (resolve) {
    logger.log({
      level: 'debug',
      message: 'Fixing binary data for an object',
      mimetype: mimetype
    });

    switch (mimetype) {
      case _constants.MIMETYPES.TEXT:
        resolve({
          'font-size': '4px'
        });
        return;

      case _constants.MIMETYPES.PNG:
        resolve("data:image/png;base64,".concat(binaryData));
        return;

      default:
        resolve(binaryData);
    }
  });
};

exports.fixBinaryData = fixBinaryData;

var placeholder = function placeholder() {};

exports.placeholder = placeholder;
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(logger, "logger", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/mimetypeHelpers.js");
  reactHotLoader.register(fixBinaryData, "fixBinaryData", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/mimetypeHelpers.js");
  reactHotLoader.register(placeholder, "placeholder", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/mimetypeHelpers.js");
  leaveModule(module);
})();

;