"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProof = exports.getDocumentProof = void 0;

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

// @Flow

/**
 * Wrapper function for getting a document proof.
 *
 * @param {MongoClient} mongoClient - The MongoClient object for executing the
 * @param {getDocumentProofParams} parameters - Object containing the parameters.
 *   @param {string} parameters.collection - The collection the document exists in.
 *   NOTE: Only one of (filter | provenDbId) should be provided.
 *   @param {Object} parameters.filter - The filter applied for finding the select document.
 *   @param {string} parameters.provenDbId - The provenDbID value of the document.
 *   @param {'json' | 'binary'} parameters.format - The format of the returned proof.
 * @returns {Promise} - A promise resolving the result of the command.
 * @returns {Promise} - A promise rejecting with a sanitization error or a mongodb error.
 */
var getDocumentProof = function getDocumentProof(mongoClient, parameters) {
  return new Promise(function (resolve, reject) {
    // Sanitization of parameters:
    if (parameters.filter && parameters.provenDbId) {
      reject(new Error({
        message: 'getDocumentProof can only contain one of parameters.filter and parameters.provenDbId'
      }));
    } else if (!parameters.collection || !parameters.version || !parameters.filter && !parameters.provenDbId) {
      reject(new Error({
        message: 'getDocumentProof has the following required parameters [collection, (filter | provenDbId), version, format]'
      }));
    } else if (!mongoClient) {
      reject(new Error({
        message: 'getDocumentProof requires a connected mongoClient.'
      }));
    } // Execution of command


    mongoClient.command({
      getDocumentProof: parameters
    }, function (getProofError, getProofResult) {
      if (getProofError) {
        reject(new Error({
          message: 'Error getting proof: ',
          getProofError: getProofError
        }));
      } else {
        resolve(getProofResult);
      }
    });
  });
};

exports.getDocumentProof = getDocumentProof;

var getProof = function getProof(mongoClient, parameters) {
  return new Promise(function (resolve, reject) {
    mongoClient.command({
      getDocumentProof: parameters
    }, function (getProofError, getProofResult) {
      if (getProofError) {
        reject(new Error({
          message: 'Error getting proof: ',
          getProofError: getProofError
        }));
      } else {
        resolve(getProofResult);
      }
    });
  });
};

exports.getProof = getProof;
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(getDocumentProof, "getDocumentProof", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/provendb-sdk/proofs.js");
  reactHotLoader.register(getProof, "getProof", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/provendb-sdk/proofs.js");
  leaveModule(module);
})();

;