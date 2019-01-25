"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ERROR_CODES = exports.DEBUG_LEVELS = exports.MIMETYPES = exports.DOMAINS = exports.SUPPORTED_FILE_TYPES = void 0;

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

var SUPPORTED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'application/json', 'image/svg+xml', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
exports.SUPPORTED_FILE_TYPES = SUPPORTED_FILE_TYPES;
var DOMAINS = {
  ID: process.env.USER_MODULE_URL || 'localhost:8000',
  PROVENDOCS: process.env.DOCS_URL || 'localhost:8888',
  API: process.env.API_URL || 'localhost:8080',
  INTERNAL_API: process.env.INTERNAL_API_URL || 'localhost:8080' // TODO: this is just added for the local kubernetes deployment

};
exports.DOMAINS = DOMAINS;
var MIMETYPES = {
  EMAIL: 'email',
  PDF: 'application/pdf',
  PNG: 'image/png',
  JPEG: 'image/jpeg',
  SVG: 'image/svg+xml',
  OCTET_STREAM: 'application/octet-stream',
  JSON: 'application/json',
  TEXT: 'text/plain',
  DOC: 'application/msword',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
};
exports.MIMETYPES = MIMETYPES;
var DEBUG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  ERROR: 'error'
};
exports.DEBUG_LEVELS = DEBUG_LEVELS;
var ERROR_CODES = {
  FAILED_TO_SUBMIT_PROOF: 1001,
  FAILED_TO_READ_FILE: 1002,
  FAILED_TO_WRITE_FILE: 1003,
  MAMMOTH_DOCX_2_HTML_ERROR: 1004
};
exports.ERROR_CODES = ERROR_CODES;
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(SUPPORTED_FILE_TYPES, "SUPPORTED_FILE_TYPES", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/common/constants.js");
  reactHotLoader.register(DOMAINS, "DOMAINS", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/common/constants.js");
  reactHotLoader.register(MIMETYPES, "MIMETYPES", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/common/constants.js");
  reactHotLoader.register(DEBUG_LEVELS, "DEBUG_LEVELS", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/common/constants.js");
  reactHotLoader.register(ERROR_CODES, "ERROR_CODES", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/common/constants.js");
  leaveModule(module);
})();

;