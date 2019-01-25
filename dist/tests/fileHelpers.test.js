"use strict";

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _fileHelpers = require("../helpers/fileHelpers.js");

var _constants = require("./constants.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable */
describe('File Helpers Test Suite', function () {
  beforeAll(function () {});
  afterAll(function () {
    _fs.default.unlinkSync(_path.default.join(__dirname, '../uploads', 'test.txt'));

    _fs.default.unlinkSync(_path.default.join(__dirname, '../uploads', 'test.json'));

    _fs.default.unlinkSync(_path.default.join(__dirname, '../uploads', 'test.yml'));

    _fs.default.unlinkSync(_path.default.join(__dirname, '../uploads', 'test.svg'));

    _fs.default.unlinkSync(_path.default.join(__dirname, '../uploads', 'test.png'));

    _fs.default.unlinkSync(_path.default.join(__dirname, '../uploads', 'test.pdf'));
  }); // TXT File Tests

  it('Can convert a .txt file to Binary.', function () {
    var expectedBinary = _constants.BINARY_DATA.TXT;
    var files = [{
      path: _path.default.join(__dirname, 'testFiles/test.txt'),
      originalname: 'test.txt',
      mimetype: 'text/plain',
      encoding: '7bit'
    }];
    return (0, _fileHelpers.convertToBinary)(files).then(function (result) {
      expect(result[0].encodedFile).toBe(expectedBinary);
    }).catch(function (error) {
      console.log(error);
      expect(false).toEqual(true);
    });
  });
  it('Can decode a .txt file from Binary.', function () {
    var expectedFile = _constants.FILE_DATA.TXT;
    var file = {
      name: 'test.txt',
      binaryData: _constants.BINARY_DATA.TXT,
      mimetype: 'text/plain',
      encoding: '7bit'
    };
    return (0, _fileHelpers.decodeFile)(file).then(function (result) {
      _fs.default.readFile(result, 'utf-8', function (err, data) {
        if (err) {
          console.log(err);
          expect(false.toEqual(true));
        }

        expect(data).toBe(expectedFile);
      });
    }).catch(function (error) {
      console.log(error);
      expect(false).toEqual(true);
    });
  });
  it('Can convert a .txt file to HTML', function () {
    var fileInfo = {
      name: 'test.txt',
      binaryData: _constants.BINARY_DATA.TXT,
      mimetype: 'text/plain',
      encoding: '7bit'
    };

    var filePath = _path.default.join(__dirname, '../uploads', 'test.txt');

    return (0, _fileHelpers.convertFileToHTML)(filePath, fileInfo).then(function (result) {
      expect(result.content).toBe(_constants.HTML_DATA.TXT);
    }).catch(function (error) {
      console.log(error);
      expect(false).toEqual(true);
    });
  }); // YML File tests

  it('Can convert a .yml file to Binary.', function () {
    var expectedBinary = _constants.BINARY_DATA.YML;
    var files = [{
      path: _path.default.join(__dirname, 'testFiles/test.yml'),
      originalname: 'test.yml',
      mimetype: 'application/octet-stream',
      encoding: '7bit'
    }];
    return (0, _fileHelpers.convertToBinary)(files).then(function (result) {
      expect(result[0].encodedFile).toBe(expectedBinary);
    }).catch(function (error) {
      console.log(error);
      expect(false).toEqual(true);
    });
  });
  it('Can decode a .yml file from Binary.', function () {
    var expectedFile = _constants.FILE_DATA.YML;
    var file = {
      name: 'test.yml',
      binaryData: _constants.BINARY_DATA.YML,
      mimetype: 'application/octet-stream',
      encoding: '7bit'
    };
    return (0, _fileHelpers.decodeFile)(file).then(function (result) {
      _fs.default.readFile(result, 'utf-8', function (err, data) {
        if (err) {
          console.log(err);
          expect(false.toEqual(true));
        }

        expect(data).toBe(expectedFile);
      });
    }).catch(function (error) {
      console.log(error);
      expect(false).toEqual(true);
    });
  });
  it('Can convert a .yml file to HTML', function () {
    var fileInfo = {
      name: 'test.yml',
      binaryData: _constants.BINARY_DATA.YML,
      mimetype: 'application/octet-stream',
      encoding: '7bit'
    };

    var filePath = _path.default.join(__dirname, '../uploads', 'test.yml');

    return (0, _fileHelpers.convertFileToHTML)(filePath, fileInfo).then(function (result) {
      expect(result.content).toBe(_constants.HTML_DATA.YML);
    }).catch(function (error) {
      console.log(error);
      expect(false).toEqual(true);
    });
  }); // YML File tests

  it('Can convert a .json file to Binary.', function () {
    var expectedBinary = _constants.BINARY_DATA.JSON;
    var files = [{
      path: _path.default.join(__dirname, 'testFiles/test.json'),
      originalname: 'test.json',
      mimetype: 'application/json',
      encoding: '7bit'
    }];
    return (0, _fileHelpers.convertToBinary)(files).then(function (result) {
      expect(result[0].encodedFile).toBe(expectedBinary);
    }).catch(function (error) {
      console.log(error);
      expect(false).toEqual(true);
    });
  });
  it('Can decode a .json file from Binary.', function () {
    var expectedFile = _constants.FILE_DATA.JSON;
    var file = {
      name: 'test.json',
      binaryData: _constants.BINARY_DATA.JSON,
      mimetype: 'application/json',
      encoding: '7bit'
    };
    return (0, _fileHelpers.decodeFile)(file).then(function (result) {
      _fs.default.readFile(result, 'utf-8', function (err, data) {
        if (err) {
          console.log(err);
          expect(false.toEqual(true));
        }

        expect(data).toBe(expectedFile);
      });
    }).catch(function (error) {
      console.log(error);
      expect(false).toEqual(true);
    });
  });
  it('Can convert a .json file to HTML', function () {
    var fileInfo = {
      name: 'test.json',
      binaryData: _constants.BINARY_DATA.JSON,
      mimetype: 'application/json',
      encoding: '7bit'
    };

    var filePath = _path.default.join(__dirname, '../uploads', 'test.json');

    return (0, _fileHelpers.convertFileToHTML)(filePath, fileInfo).then(function (result) {
      expect(result.content).toBe(_constants.HTML_DATA.JSON);
    }).catch(function (error) {
      console.log(error);
      expect(false).toEqual(true);
    });
  }); // PNG File Tests

  it('Can convert a .png file to Binary.', function () {
    var expectedBinary = _constants.BINARY_DATA.PNG;
    var files = [{
      path: _path.default.join(__dirname, 'testFiles/test.png'),
      originalname: 'test.png',
      mimetype: 'image/png',
      encoding: '7bit'
    }];
    return (0, _fileHelpers.convertToBinary)(files).then(function (result) {
      expect(result[0].encodedFile).toBe(expectedBinary);
    }).catch(function (error) {
      console.log(error);
      expect(false).toEqual(true);
    });
  });
  it('Can decode a .png file from Binary.', function () {
    var expectedFile = _constants.FILE_DATA.PNG;
    var file = {
      name: 'test.png',
      binaryData: _constants.BINARY_DATA.PNG,
      mimetype: 'image/png',
      encoding: '7bit'
    };
    return (0, _fileHelpers.decodeFile)(file).then(function (result) {
      expect(true).toEqual(true);
    }).catch(function (error) {
      console.log(error);
      expect(false).toEqual(true);
    });
  });
  it('Can convert a .png file to HTML', function () {
    var fileInfo = {
      name: 'test.png',
      binaryData: _constants.BINARY_DATA.PNG,
      mimetype: 'image/png',
      encoding: '7bit'
    };

    var filePath = _path.default.join(__dirname, '../uploads', 'test.png');

    return (0, _fileHelpers.convertFileToHTML)(filePath, fileInfo).then(function (result) {
      expect(result.content).toBe(_constants.HTML_DATA.PNG);
    }).catch(function (error) {
      console.log(error);
      expect(false).toEqual(true);
    });
  }); // SVG File Tests

  it('Can convert a .svg file to Binary.', function () {
    var expectedBinary = _constants.BINARY_DATA.SVG;
    var files = [{
      path: _path.default.join(__dirname, 'testFiles/test.svg'),
      originalname: 'test.svg',
      mimetype: 'application/image+svg',
      encoding: '7bit'
    }];
    return (0, _fileHelpers.convertToBinary)(files).then(function (result) {
      expect(result[0].encodedFile).toBe(expectedBinary);
    }).catch(function (error) {
      console.log(error);
      expect(false).toEqual(true);
    });
  });
  it('Can decode a .svg file from Binary.', function () {
    var expectedFile = _constants.FILE_DATA.SVG;
    var file = {
      name: 'test.svg',
      binaryData: _constants.BINARY_DATA.SVG,
      mimetype: 'image/svg+xml',
      encoding: '7bit'
    };
    return (0, _fileHelpers.decodeFile)(file).then(function (result) {
      _fs.default.readFile(result, 'utf-8', function (err, data) {
        if (err) {
          console.log(err);
          expect(false.toEqual(true));
        }

        expect(data).toBe(expectedFile);
      });
    }).catch(function (error) {
      console.log(error);
      expect(false).toEqual(true);
    });
  });
  it('Can convert a .svg file to HTML', function () {
    var fileInfo = {
      name: 'test.svg',
      binaryData: _constants.BINARY_DATA.SVG,
      mimetype: 'image/svg+xml',
      encoding: '7bit'
    };

    var filePath = _path.default.join(__dirname, '../uploads', 'test.svg');

    return (0, _fileHelpers.convertFileToHTML)(filePath, fileInfo).then(function (result) {
      expect(result.content).toBe(_constants.HTML_DATA.SVG);
    }).catch(function (error) {
      console.log(error);
      expect(false).toEqual(true);
    });
  }); // PDF Tests

  it('Can convert a .pdf file to Binary.', function () {
    var expectedBinary = _constants.BINARY_DATA.PDF;
    var files = [{
      path: _path.default.join(__dirname, 'testFiles/test.pdf'),
      originalname: 'test.pdf',
      mimetype: 'image/pdf',
      encoding: '7bit'
    }];
    return (0, _fileHelpers.convertToBinary)(files).then(function (result) {
      expect(result[0].encodedFile).toBe(expectedBinary);
    }).catch(function (error) {
      console.log(error);
      expect(false).toEqual(true);
    });
  });
  it('Can decode a .pdf file from Binary.', function () {
    var expectedFile = _constants.FILE_DATA.PDF;
    var file = {
      name: 'test.pdf',
      binaryData: _constants.BINARY_DATA.PDF,
      mimetype: 'application/json',
      encoding: '7bit'
    };
    return (0, _fileHelpers.decodeFile)(file).then(function (result) {
      expect(true).toEqual(true);
    }).catch(function (error) {
      console.log(error);
      expect(false).toEqual(true);
    });
  });
  it.skip('Can convert a .pdf file to HTML', function () {
    var fileInfo = {
      name: 'test.pdf',
      binaryData: _constants.BINARY_DATA.PDF,
      mimetype: 'application/pdf',
      encoding: '7bit'
    };

    var filePath = _path.default.join(__dirname, '../uploads', 'test.pdf');

    return (0, _fileHelpers.convertFileToHTML)(filePath, fileInfo).then(function (result) {
      expect(result.content).toMatch(_constants.HTML_DATA.PDF);
    }).catch(function (error) {
      console.log(error);
      expect(false).toEqual(true);
    });
  });
});