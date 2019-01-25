"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPDF = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _winston = _interopRequireDefault(require("winston"));

var _qrImage = _interopRequireDefault(require("qr-image"));

var _winstonConfig = require("../modules/winston.config.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

var PDFDocument = require('pdfkit');

var logger = _winston.default.createLogger({
  transports: [new _winston.default.transports.Console({
    level: process.env.PROVENDOCS_LOG_LEVEL || 'debug',
    json: true,
    colorize: true,
    format: _winstonConfig.certificateAPIFormat
  })]
});
/**
 * Takes a document object and appends a header to it.
 * @param {*} doc - The document to append the header
 * @param {*} proof - The proof JSON object containing information about the proof.
 * @param {*} file - The file JSON object containing information about the document.
 * @param {*} user - The user JSON object containing information about the owner of the document.
 * @returns A Promise resolving the document object.
 */


var addHeader = function addHeader(doc, file) {
  return new Promise(function (resolve) {
    // Add left hand logo
    doc.image(_path.default.join(__dirname, 'certificate/provenDocsHorizontalLogo@2x.png'), 35, 35, {
      scale: 0.5
    }); // Add file name center.

    doc.fillColor('#595b60').fontSize(9).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text(file.name, 175, 40, {
      width: 240,
      align: 'center',
      opacity: 0.8
    }); // Add right hand provendocs info

    doc.fillColor('#595b60').fontSize(9).font(_path.default.join(__dirname, 'certificate/Roboto-Medium.ttf')).text('provendocs.com', 415, 35, {
      width: 140,
      align: 'right'
    });
    doc.fillColor('#595b60').fontSize(9).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text('info@provendocs.com', 415, 50, {
      width: 140,
      align: 'right',
      opacity: 0.8
    }); // Add underline.

    doc.moveTo(35, 70).lineTo(555, 70).strokeOpacity(0.8).strokeColor('#707070').stroke();
    resolve(doc);
  });
};
/**
 * Takes a document object and appends a footer to it.
 * @param {*} doc - The document to append the footer.
 * @param {*} proof - The proof JSON object containing information about the proof.
 * @param {*} file - The file JSON object containing information about the document.
 * @param {*} user - The user JSON object containing information about the owner of the document.
 * @returns A Promise resolving the document object.
 */


var addFooter = function addFooter(doc, file, pageNumber) {
  return new Promise(function (resolve) {
    doc.fillColor('#595b60').fontSize(9).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text('Proof of ProvenDocs document ', 35, 700, {
      align: 'left',
      opacity: 0.5,
      continued: true
    }).fillColor('#31b2d4').text("".concat(file._provendb_metadata.hash), {
      link: "https://provendocs.com/proof/".concat(file._provendb_metadata.hash)
    });
    doc.fillColor('#595b60').fontSize(9).font(_path.default.join(__dirname, 'certificate/Roboto-Regular.ttf')).text("Page ".concat(pageNumber, " of 4"), 475, 700, {
      align: 'right',
      opacity: 0.5
    });
    resolve(doc);
  });
};
/**
 * Takes a document object and appends the front page.
 * @param {*} doc - The document to append the front page to.
 * @param {*} proof - The proof JSON object containing information about the proof.
 * @param {*} file - The file JSON object containing information about the document.
 * @param {*} user - The user JSON object containing information about the owner of the document.
 * @returns A Promise resolving the document object.
 */


var addFrontPage = function addFrontPage(doc, proof, file, user) {
  return new Promise(function (resolve) {
    // Constant strings.
    var bodyText = 'This certificate constitutes proof that a document has been anchored to the bitcoin blockchain, thereby proving that the document existed in its current form on the date at which the blockchain entry was created.';
    var bodyTextTwo = 'You can use this proof to attest that:';
    var bodyTextThree = '(a) the document has not been altered in any way.';
    var bodyTextFour = '(b) the document existed in its current from on the specified date.'; // Add Images

    doc.image(_path.default.join(__dirname, 'certificate/provenDocsVerticalLogo@2x.png'), 227, 50, {
      scale: 0.5
    });
    doc.image(_path.default.join(__dirname, 'certificate/provenDocsSeal@2x.png'), 420, 600, {
      scale: 0.5
    }); // Add border

    doc.moveTo(25, 25).lineTo(25, 770).lineTo(590, 770).lineTo(590, 25).lineTo(25, 25).strokeOpacity(0.8).strokeColor('#595b60').stroke(); // Add generic text elements

    doc.fillColor('#595b60').fontSize(25).font(_path.default.join(__dirname, 'certificate/Roboto-Regular.ttf')).text('Certificate of Blockchain Proof', 207, 250, {
      width: 190,
      align: 'center'
    });
    doc.fillColor('#595b60').fontSize(12).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text(bodyText, 135, 450, {
      width: 350,
      align: 'center',
      opacity: 0.8
    });
    doc.fillColor('#595b60').fontSize(12).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text(bodyTextTwo, 205, 520, {
      width: 350,
      align: 'left',
      opacity: 0.8
    });
    doc.fillColor('#595b60').fontSize(12).font(_path.default.join(__dirname, 'certificate/Roboto-LightItalic.ttf')).text(bodyTextThree, 165, 545, {
      width: 350,
      align: 'left',
      opacity: 0.8
    });
    doc.fillColor('#595b60').fontSize(12).font(_path.default.join(__dirname, 'certificate/Roboto-LightItalic.ttf')).text(bodyTextFour, 130, 560, {
      width: 350,
      align: 'left',
      opacity: 0.8
    }); // Add Document Name and User

    var userString = "".concat(user.name, " (").concat(user.provider, " user: ");
    doc.fillColor('#58595b').fontSize(14).font(_path.default.join(__dirname, 'certificate/Roboto-Regular.ttf')).text(file.name, 135, 350, {
      width: 350,
      align: 'center'
    });
    doc.moveDown();
    doc.fillColor('#595b60').fontSize(12).font(_path.default.join(__dirname, 'certificate/Roboto-LightItalic.ttf')).text("".concat(userString, " "), {
      align: 'left',
      opacity: 0.8,
      continued: true
    }).fillColor('#31b2d4').text("".concat(user.email, ")"), {
      link: "mailto:".concat(user.email)
    }); // Add Footer Link

    var footerString = 'An online version of this proof can be found at:';
    doc.fillColor('#595b60').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text(footerString, 58, 725, {
      height: 50,
      width: 240,
      align: 'left',
      opacity: 0.8
    });
    doc.fillColor('#31b2d4').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text("https://provendocs.com/proof/".concat(file._provendb_metadata._id), 58, 745, {
      height: 50,
      width: 400,
      align: 'left',
      opacity: 0.8,
      link: "https://provendocs.com/proof/".concat(file._provendb_metadata._id)
    }); // Create QR Code:

    var qrSVG = _qrImage.default.imageSync("https://provendocs.com/proof/".concat(file._provendb_metadata._id), {
      type: 'png',
      size: 3,
      margin: 0
    });

    doc.image(qrSVG, 58, 610, {
      scale: 1
    });
    resolve(doc);
  });
};
/**
 * Takes a document object and appends the second page.
 * @param {*} doc - The document to append the second page to.
 * @param {*} proof - The proof JSON object containing information about the proof.
 * @param {*} file - The file JSON object containing information about the document.
 * @param {*} user - The user JSON object containing information about the owner of the document.
 * @returns A Promise resolving the document object.
 */


var addSecondPage = function addSecondPage(doc, proof, file, user) {
  return new Promise(function (resolve) {
    // First add a new page.
    doc.addPage(); // Add Header.

    addHeader(doc, file).then(function (newDoc) {
      // UTC Timestamp conversion
      var uploadDate = new Date(Date.parse(file.uploadedAt));
      var finalUploadDate = uploadDate.toISOString().replace(/[-:.Z]/g, '');
      newDoc.fillColor('#595b60').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-LightItalic.ttf')).text("The document was uploaded by ".concat(user.name, " (").concat(user.provider, " user: "), 35, 91, {
        align: 'left',
        opacity: 0.8,
        continued: true
      }).fillColor('#31b2d4').text("".concat(user.email, ")"), {
        continued: true
      }).fillColor('#595b60').text(' at ', {
        continued: true
      }).fillColor('#31b2d4').text("".concat(file.uploadedAt), {
        link: "https://www.timeanddate.com/worldclock/converter.html?iso=".concat(finalUploadDate, "&p1=1440&p2=152&p3=136&p4=179&p5=137&p6=33&p7=248")
      });
      newDoc.moveDown();
      newDoc.fillColor('#595b60').font(_path.default.join(__dirname, 'certificate/Roboto-Bold.ttf')).fontSize(12).text('Details of the document being proved');
      newDoc.moveDown();
      newDoc.fillColor('#595b60').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text('The document name when hashed was ', {
        continued: true
      }).font(_path.default.join(__dirname, 'certificate/Roboto-LightItalic.ttf')).text("\"".concat(file.name, "\""), {});
      newDoc.moveDown();
      newDoc.fillColor('#595b60').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text('You can view a copy of this document at: ', {
        continued: true
      }).fillColor('#31b2d4').text("https://provendocs.com/document/".concat(file._provendb_metadata._id), {
        link: "https://provendocs.com/document/".concat(file._provendb_metadata._id)
      });
      newDoc.fillColor('#595b60').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text('(permissions may be required to view the document)');
      newDoc.moveDown();
      newDoc.fillColor('#595b60').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text('The cryptographic hash of the document is:');
      newDoc.fillColor('#595b60').font(_path.default.join(__dirname, 'certificate/Roboto-LightItalic.ttf')).fontSize(10).text(file._provendb_metadata.hash, {});
      newDoc.moveDown();
      newDoc.fillColor('#595b60').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-LightItalic.ttf')).text('See Schedule 1 for details of the hashing algorithm employed.');
      newDoc.moveDown();
      newDoc.moveDown();
      newDoc.fillColor('#595b60').font(_path.default.join(__dirname, 'certificate/Roboto-Bold.ttf')).fontSize(12).text('Blockchain proof details');
      newDoc.moveDown();
      newDoc.fillColor('#595b60').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text('The document hash was included within the', {
        continued: true
      }).fillColor('#31b2d4').text(' Chainpoint', {
        continued: true,
        link: 'https://chainpoint.org'
      }).fillColor('#595b60').text(' proof at', {});
      newDoc.fillColor('#31b2d4').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text("".concat(proof.details.protocol.chainpointLocation), {
        link: "".concat(proof.details.protocol.chainpointLocation)
      });
      newDoc.moveDown();
      newDoc.fillColor('#595b60').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-LightItalic.ttf')).text('See Schedule 2 for a detailed cryptographic proof.');
      newDoc.moveDown();
      newDoc.fillColor('#595b60').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text('The Chainpoint proof was anchored to the bitcoin blockchain at block ', {
        continued: true
      }).fillColor('#31b2d4').text("".concat(proof.documentProof.btcBlockNumber, " "), {
        continued: true,
        link: "https://live.blockcypher.com/btc/block/".concat(proof.documentProof.btcBlockNumber, "/")
      }).fillColor('#595b60').text('in bitcoin transaction', {}); // UTC Timestamp conversion

      var date = new Date(Date.parse(proof.submitted));
      var newFinalDate = date.toISOString().replace(/[-:.Z]/g, '');
      newDoc.fillColor('#31b2d4').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text("".concat(proof.documentProof.btcTransaction), {
        continued: true,
        link: "https://live.blockcypher.com/btc/tx/".concat(proof.documentProof.btcTransaction, "/")
      }).fillColor('#595b60').text(' at UTC: ', {
        continued: true
      }).fillColor('#31b2d4').text("".concat(date.toISOString()), {
        link: "https://www.timeanddate.com/worldclock/converter.html?iso=".concat(newFinalDate, "&p1=1440&p2=152&p3=136&p4=179&p5=137&p6=33&p7=248")
      });
      newDoc.moveDown();
      newDoc.moveDown();
      newDoc.fillColor('#595b60').font(_path.default.join(__dirname, 'certificate/Roboto-Bold.ttf')).fontSize(12).text('Summary', {
        align: 'left'
      });
      newDoc.moveDown();
      newDoc.fillColor('#595b60').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text('The document ', {
        continued: true
      }).fillColor('#595b60').font(_path.default.join(__dirname, 'certificate/Roboto-LightItalic.ttf')).text("".concat(file.name, " "), {
        continued: true
      }).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).fillColor('#595b60').text(' with hash value', {});
      newDoc.fillColor('#595b60').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-LightItalic.ttf')).text("".concat(file._provendb_metadata.hash), {
        continued: true
      }).fillColor('#595b60').font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text(' was anchored to the bitcoin blockchain', {});
      newDoc.fillColor('#595b60').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text("by ".concat(user.name, " (").concat(user.provider, " user: "), {
        continued: true
      }).fillColor('#31b2d4').text(user.email, {
        continued: true,
        link: "mailto:".concat(user.email)
      }).fillColor('#595b60').text(') at UTC: ', {
        continued: true
      }).fillColor('#31b2d4').text("".concat(file.uploadedAt), {
        continued: true,
        link: "https://www.timeanddate.com/worldclock/converter.html?iso=".concat(finalUploadDate, "&p1=1440&p2=152&p3=136&p4=179&p5=137&p6=33&p7=248")
      }).fillColor('#595b60').text('. Providing that the document continues to hash to that value, you can be certain that the document existed in its current form on or before that date.', {});
      newDoc.image(_path.default.join(__dirname, 'certificate/provenDocsIcon@2x.png'), 190, 285, {
        scale: 0.5
      });
      addFooter(newDoc, file, 2).then(function (doc2) {
        resolve(doc2);
      });
    });
  });
};
/**
 * Takes a document object and appends the third page.
 * @param {*} doc - The document to append the third page to.
 * @param {*} proof - The proof JSON object containing information about the proof.
 * @param {*} file - The file JSON object containing information about the document.
 * @returns A Promise resolving the document object.
 */


var addThirdPage = function addThirdPage(doc, proof, file) {
  return new Promise(function (resolve) {
    doc.addPage();
    addHeader(doc, file).then(function (newDoc) {
      newDoc.moveTo(35, 85);
      newDoc.fillColor('#595b60').font(_path.default.join(__dirname, 'certificate/Roboto-Bold.ttf')).fontSize(12).text('Schedule 1: Document hashing', 35, 85);
      newDoc.moveDown();
      newDoc.fillColor('#595b60').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text('The document hash of ', {
        continued: true
      }).font(_path.default.join(__dirname, 'certificate/Roboto-LightItalic.ttf')).text("".concat(file._provendb_metadata.hash), {});
      newDoc.fillColor('#595b60').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text('was obtained by performing a ', {
        continued: true
      }).fillColor('#31b2d4').text('SHA-2 256 bit ', {
        continued: true,
        link: 'https://en.wikipedia.org/wiki/SHA-2'
      }).fillColor('#595b60').text('hash on the document at', {});
      newDoc.fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).fillColor('#31b2d4').text("https://provendocs/documents/".concat(file._provendb_metadata._id), {
        continued: true,
        link: "https://provendocs/documents/".concat(file._provendb_metadata._id)
      }).fillColor('#595b60').text(' (permission may be required to view this document).', {});
      newDoc.fillColor('#595b60').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text('The hash was calculated on the document and its metadata as stored in the ProvenDocs system.');
      newDoc.moveDown();
      newDoc.fillColor('#595b60').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text('You can download a copy of the document and its metadata (permissions required) at');
      newDoc.fillColor('#31b2d4').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text("https://provendocs/documents/".concat(file._provendb_metadata._id, "/download."), {
        continued: true,
        link: "https://provendocs/documents/".concat(file._provendb_metadata._id)
      }).fillColor('#595b60').text('You can independently validate the hash by using the', {});
      newDoc.fillColor('#595b60').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text('open source hash validation tool at ', {
        continued: true
      }).fillColor('#31b2d4').text('https://provendocs.com/downloads/validateHash.', {
        continued: true,
        link: 'https://provendocs.com/downloads/validateHash'
      }).fillColor('#595b60').text('You can also extract the', {});
      newDoc.fillColor('#595b60').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text('document from its metadata using this tool.');
      newDoc.moveDown();
      newDoc.moveDown();
      newDoc.fillColor('#595b60').font(_path.default.join(__dirname, 'certificate/Roboto-Bold.ttf')).fontSize(12).text('Schedule 2: Chainpoint proof');
      newDoc.moveDown();
      newDoc.fillColor('#595b60').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text('Chainpoint is an open standard for linking data to the public blockchain. It aggregates multiple hash values into a single');
      newDoc.fillColor('#595b60').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text('hash value which is then placed on the blockchain. The following chainpoint proof proves that the hash value of');
      newDoc.fillColor('#595b60').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-LightItalic.ttf')).text("".concat(file._provendb_metadata.hash), {});
      newDoc.fillColor('#595b60').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text('is associated with the chainpoint proof placed on the bitcoin blockchain in transaction');
      newDoc.fillColor('#31b2d4').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text("".concat(proof.documentProof.btcTransaction), {
        link: "https://live.blockcypher.com/btc/tx/".concat(proof.documentProof.btcTransaction, "/")
      });
      newDoc.moveDown();
      newDoc.fillColor('#595b60').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-LightItalic.ttf')).text('This proof can be downloaded (permissions required) from ', {
        continued: true
      }).fillColor('#31b2d4').text("https://provendocs.com/proofs/".concat(file._provendb_metadata._id), {
        link: "https://provendocs.com/proofs/".concat(file._provendb_metadata._id)
      });
      newDoc.moveDown();
      newDoc.moveDown();
      newDoc.fillColor('#595b60').font(_path.default.join(__dirname, 'certificate/Roboto-Bold.ttf')).fontSize(12).text('Below is a binary representation of the Blockchain proof');
      newDoc.moveDown();
      newDoc.fillColor('#595b60').fontSize(8).font(_path.default.join(__dirname, 'certificate/Roboto-LightItalic.ttf')).text(proof && proof.documentProof && proof.documentProof.proof && proof.documentProof.proof.toString('base64') || '', {
        width: 500,
        align: 'justify'
      });
      newDoc.image(_path.default.join(__dirname, 'certificate/provenDocsIcon@2x.png'), 190, 285, {
        scale: 0.5
      });
      addFooter(newDoc, file, 3).then(function (doc2) {
        resolve(doc2);
      });
    });
  });
};
/**
 * Takes a document object and appends the fourth page.
 * @param {*} doc - The document to append the fourth page to.
 * @param {*} proof - The proof JSON object containing information about the proof.
 * @param {*} file - The file JSON object containing information about the document.
 * @returns A Promise resolving the document object.
 */


var addFourthPage = function addFourthPage(doc, proof, file) {
  return new Promise(function (resolve) {
    doc.addPage();
    addHeader(doc, file).then(function (newDoc) {
      newDoc.moveTo(35, 85);
      newDoc.fillColor('#595b60').font(_path.default.join(__dirname, 'certificate/Roboto-Bold.ttf')).fontSize(12).text('Schedule 3: List of printable links in the document', 35, 85);
      newDoc.moveDown();
      newDoc.fillColor('#595b60').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text('Document being proven:');
      newDoc.fillColor('#31b2d4').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text("https://provendocs.com/document/".concat(file._provendb_metadata._id), {
        link: "https://provendocs.com/document/".concat(file._provendb_metadata._id)
      });
      newDoc.moveDown();
      newDoc.fillColor('#595b60').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text('Chainpoint.org:');
      newDoc.fillColor('#31b2d4').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text('https://chainpoint.org', {
        link: 'https://chainpoint.org'
      });
      newDoc.image(_path.default.join(__dirname, 'certificate/provenDocsIcon@2x.png'), 190, 285, {
        scale: 0.5
      });
      newDoc.moveDown();
      newDoc.fillColor('#595b60').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text('Chainpoint proof for the document:');
      newDoc.fillColor('#31b2d4').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text("https://provendocs/proofs/".concat(file._provendb_metadata._id), {
        link: "https://provendocs/proofs/".concat(file._provendb_metadata._id)
      });
      newDoc.moveDown();
      newDoc.fillColor('#595b60').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text('Chainpoint calendar entry for the proven document:');
      newDoc.fillColor('#31b2d4').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text(proof.details.protocol.chainpointLocation, {
        link: proof.details.protocol.chainpointLocation
      });
      newDoc.moveDown();
      newDoc.fillColor('#595b60').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text('Bitcoin block containing the proof:');
      newDoc.fillColor('#31b2d4').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text("https://live.blockcypher.com/btc/block/".concat(proof.documentProof.btcBlockNumber), {
        link: "https://live.blockcypher.com/btc/block/".concat(proof.documentProof.btcBlockNumber)
      });
      newDoc.moveDown();
      newDoc.fillColor('#595b60').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text('Blockchain transaction:');
      newDoc.fillColor('#31b2d4').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text("https://live.blockcypher.com/btc/tx/".concat(proof.documentProof.btcTransaction), {
        link: "https://live.blockcypher.com/btc/tx/".concat(proof.documentProof.btcTransaction)
      });
      newDoc.moveDown();
      newDoc.fillColor('#595b60').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text('Open source validation tool:');
      newDoc.fillColor('#31b2d4').fontSize(10).font(_path.default.join(__dirname, 'certificate/Roboto-Light.ttf')).text('http://provendocs.com/downloads/validateHash', {
        link: 'http://provendocs.com/downloads/validateHash'
      });
      addFooter(newDoc, file, 3).then(function (doc2) {
        resolve(doc2);
      });
    });
  });
};
/**
 * Create a new PDF Proof Certificate for a file.
 * @param {*} proof - The proof JSON object containing information about the proof.
 * @param {*} file - The file JSON object containing information about the document.
 * @param {*} user - The user JSON object containing information about the owner of the document.
 * @returns A Promise resolving the file path for the PDF.
 */


var createPDF = function createPDF(proof, documentProof, file, user) {
  return new Promise(function (resolve, reject) {
    try {
      logger.log({
        level: 'info',
        message: 'Creating PDF for proof',
        file: file.name,
        user: user,
        proof: proof,
        documentProof: documentProof
      });
      var singleProof = proof.proofs[0];
      var docProof = documentProof.proofs[0];
      singleProof.documentProof = docProof;
      var document = new PDFDocument();

      var path = _path.default.join(__dirname, "certificates/proof_certificate_".concat(file._id, ".pdf"));

      var writeStream = _fs.default.createWriteStream(path);

      document.pipe(writeStream);
      writeStream.on('close', function () {
        resolve(path);
      });
      writeStream.on('finish', function () {
        resolve(path);
      });
      addFrontPage(document, singleProof, file, user).then(function (doc2) {
        addSecondPage(doc2, singleProof, file, user).then(function (doc3) {
          addThirdPage(doc3, singleProof, file).then(function (doc4) {
            addFourthPage(doc4, singleProof, file).then(function () {
              document.end();
            });
          });
        });
      });
    } catch (e) {
      logger.log({
        level: 'error',
        message: 'Error caught while creating PDF.',
        file: file.name,
        user: user,
        e: e
      });
      reject(e);
    }
  });
};

exports.createPDF = createPDF;
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(logger, "logger", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/certificateBuilder.js");
  reactHotLoader.register(addHeader, "addHeader", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/certificateBuilder.js");
  reactHotLoader.register(addFooter, "addFooter", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/certificateBuilder.js");
  reactHotLoader.register(addFrontPage, "addFrontPage", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/certificateBuilder.js");
  reactHotLoader.register(addSecondPage, "addSecondPage", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/certificateBuilder.js");
  reactHotLoader.register(addThirdPage, "addThirdPage", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/certificateBuilder.js");
  reactHotLoader.register(addFourthPage, "addFourthPage", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/certificateBuilder.js");
  reactHotLoader.register(createPDF, "createPDF", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/helpers/certificateBuilder.js");
  leaveModule(module);
})();

;