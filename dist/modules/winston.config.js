"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authFormat = exports.generalFormat = exports.certificateAPIFormat = exports.fileAPIFormat = exports.mongoAPIFormat = exports.routingLogFormat = void 0;

var _winston = _interopRequireDefault(require("winston"));

var _colors = _interopRequireDefault(require("colors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var LOG_TYPE = process.env.PROVENDOCS_LOG_TYPE || 'prod';
var baseFormat;

if (LOG_TYPE === 'prod') {
  baseFormat = _winston.default.format.combine(_winston.default.format.timestamp());
} else {
  baseFormat = _winston.default.format.combine(_winston.default.format.colorize({
    all: true
  }), _winston.default.format.timestamp(), _winston.default.format.align());
}

var routingLogFormat = _winston.default.format.combine(baseFormat, LOG_TYPE === 'prod' ? _winston.default.format.label({
  label: 'ROUTE'
}) : _winston.default.format.label({
  label: 'ROUTE'.magenta
}), _winston.default.format.printf(function (info) {
  var timestamp = info.timestamp,
      level = info.level,
      message = info.message,
      code = info.code,
      label = info.label,
      args = _objectWithoutProperties(info, ["timestamp", "level", "message", "code", "label"]);

  var ts = timestamp.slice(0, 19).replace('T', ' ');

  if (LOG_TYPE === 'prod') {
    return "{\"code\": ".concat(code || '"none"', ", \"message\": \"").concat(message, "\", \"ts\": \"").concat(ts, "\", \"label\": \"").concat(label, "\", \"level\": \"").concat(level, "\", \"args\": ").concat(Object.keys(args).length ? JSON.stringify(args, null, null) : '"none"', "}");
  }

  return "".concat(ts.yellow, " - [").concat(label, "] - [").concat(level, "]: ").concat(message, " \n").concat(Object.keys(args).length ? JSON.stringify(args, null, 2) : '');
}));

exports.routingLogFormat = routingLogFormat;

var mongoAPIFormat = _winston.default.format.combine(baseFormat, LOG_TYPE === 'prod' ? _winston.default.format.label({
  label: 'MONGO'
}) : _winston.default.format.label({
  label: 'MONGO'.green
}), _winston.default.format.printf(function (info) {
  var timestamp = info.timestamp,
      level = info.level,
      message = info.message,
      label = info.label,
      code = info.code,
      args = _objectWithoutProperties(info, ["timestamp", "level", "message", "label", "code"]);

  var ts = timestamp.slice(0, 19).replace('T', ' ');

  if (LOG_TYPE === 'prod') {
    return "{\"code\": ".concat(code || '"none"', ", \"message\": \"").concat(message, "\", \"ts\": \"").concat(ts, "\", \"label\": \"").concat(label, "\", \"level\": \"").concat(level, "\", \"args\": ").concat(Object.keys(args).length ? JSON.stringify(args, null, null) : '"none"', "}");
  }

  return "".concat(ts.yellow, " - [").concat(label, "] - [").concat(level, "]: ").concat(message, " \n").concat(Object.keys(args).length ? JSON.stringify(args, null, 2) : '');
}));

exports.mongoAPIFormat = mongoAPIFormat;

var fileAPIFormat = _winston.default.format.combine(baseFormat, LOG_TYPE === 'prod' ? _winston.default.format.label({
  label: 'FILE'
}) : _winston.default.format.label({
  label: 'FILE'.blue
}), _winston.default.format.printf(function (info) {
  var timestamp = info.timestamp,
      level = info.level,
      message = info.message,
      label = info.label,
      code = info.code,
      args = _objectWithoutProperties(info, ["timestamp", "level", "message", "label", "code"]);

  var ts = timestamp.slice(0, 19).replace('T', ' ');

  if (LOG_TYPE === 'prod') {
    return "{\"code\": ".concat(code || '"none"', ", \"message\": \"").concat(message, "\", \"ts\": \"").concat(ts, "\", \"label\": \"").concat(label, "\", \"level\": \"").concat(level, "\", \"args\": ").concat(Object.keys(args).length ? JSON.stringify(args, null, null) : '"none"', "}");
  }

  return "".concat(ts.yellow, " - [").concat(label, "] - [").concat(level, "]: ").concat(message, " \n").concat(Object.keys(args).length ? JSON.stringify(args, null, 2) : '');
}));

exports.fileAPIFormat = fileAPIFormat;

var certificateAPIFormat = _winston.default.format.combine(baseFormat, LOG_TYPE === 'prod' ? _winston.default.format.label({
  label: 'CERTIFICATE'
}) : _winston.default.format.label({
  label: 'CERTIFICATE'.yellow
}), _winston.default.format.printf(function (info) {
  var timestamp = info.timestamp,
      level = info.level,
      message = info.message,
      label = info.label,
      code = info.code,
      args = _objectWithoutProperties(info, ["timestamp", "level", "message", "label", "code"]);

  var ts = timestamp.slice(0, 19).replace('T', ' ');

  if (LOG_TYPE === 'prod') {
    return "{\"code\": ".concat(code || '"none"', ", \"message\": \"").concat(message, "\", \"ts\": \"").concat(ts, "\", \"label\": \"").concat(label, "\", \"level\": \"").concat(level, "\", \"args\": ").concat(Object.keys(args).length ? JSON.stringify(args, null, null) : '"none"', "}");
  }

  return "".concat(ts.yellow, " - [").concat(label, "] - [").concat(level, "]: ").concat(message, " \n").concat(Object.keys(args).length ? JSON.stringify(args, null, 2) : '');
}));

exports.certificateAPIFormat = certificateAPIFormat;

var generalFormat = _winston.default.format.combine(baseFormat, LOG_TYPE === 'prod' ? _winston.default.format.label({
  label: 'GENERAL'
}) : _winston.default.format.label({
  label: 'GENERAL'.white
}), _winston.default.format.printf(function (info) {
  var timestamp = info.timestamp,
      level = info.level,
      message = info.message,
      label = info.label,
      code = info.code,
      args = _objectWithoutProperties(info, ["timestamp", "level", "message", "label", "code"]);

  var ts = timestamp.slice(0, 19).replace('T', ' ');

  if (LOG_TYPE === 'prod') {
    return "{\"code\": ".concat(code || '"none"', ", \"message\": \"").concat(message, "\", \"ts\": \"").concat(ts, "\", \"label\": \"").concat(label, "\", \"level\": \"").concat(level, "\", \"args\": ").concat(Object.keys(args).length ? JSON.stringify(args, null, null) : '"none"', "}");
  }

  return "".concat(ts.yellow, " - [").concat(label, "] - [").concat(level, "]: ").concat(message, " \n").concat(Object.keys(args).length ? JSON.stringify(args, null, 2) : '');
}));

exports.generalFormat = generalFormat;

var authFormat = _winston.default.format.combine(baseFormat, LOG_TYPE === 'prod' ? _winston.default.format.label({
  label: 'AUTHENTICATION'
}) : _winston.default.format.label({
  label: 'AUTHENTICAION'.cyan
}), _winston.default.format.printf(function (info) {
  var timestamp = info.timestamp,
      level = info.level,
      message = info.message,
      label = info.label,
      code = info.code,
      args = _objectWithoutProperties(info, ["timestamp", "level", "message", "label", "code"]);

  var ts = timestamp.slice(0, 19).replace('T', ' ');

  if (LOG_TYPE === 'prod') {
    return "{\"code\": ".concat(code || '"none"', ", \"message\": \"").concat(message, "\", \"ts\": \"").concat(ts, "\", \"label\": \"").concat(label, "\", \"level\": \"").concat(level, "\", \"args\": ").concat(Object.keys(args).length ? JSON.stringify(args, null, null) : '"none"', "}");
  }

  return "".concat(ts.yellow, " - [").concat(label, "] - [").concat(level, "]: ").concat(message, " \n").concat(Object.keys(args).length ? JSON.stringify(args, null, 2) : '');
}));

exports.authFormat = authFormat;
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(LOG_TYPE, "LOG_TYPE", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/modules/winston.config.js");
  reactHotLoader.register(baseFormat, "baseFormat", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/modules/winston.config.js");
  reactHotLoader.register(routingLogFormat, "routingLogFormat", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/modules/winston.config.js");
  reactHotLoader.register(mongoAPIFormat, "mongoAPIFormat", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/modules/winston.config.js");
  reactHotLoader.register(fileAPIFormat, "fileAPIFormat", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/modules/winston.config.js");
  reactHotLoader.register(certificateAPIFormat, "certificateAPIFormat", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/modules/winston.config.js");
  reactHotLoader.register(generalFormat, "generalFormat", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/modules/winston.config.js");
  reactHotLoader.register(authFormat, "authFormat", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/modules/winston.config.js");
  leaveModule(module);
})();

;