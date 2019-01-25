"use strict";

var _certificateBuilder = require("../helpers/certificateBuilder.js");

var _constants = require("./constants.js");

/*
 * Project: /Users/mike/SouthbankSoftware/provendocs/provendocs
 * Created Date: Thursday September 20th 2018
 * Author: Michael Harrison
 * -----
 * Last Modified: Thursday September 20th 2018 4:23:15 pm
 * Modified By: Michael Harrison at <Mike@Southbanksoftware.com>
 * -----
 * Copyright (c) 2018 Southbank Software
 */

/* eslint-disable */
describe('Certificate Builder Suite', function () {
  beforeAll(function () {}); // TXT File Tests

  it.skip('Can create a PDF', function () {
    return (0, _certificateBuilder.createPDF)(_constants.PROOF_DATA.COMPLETED, _constants.FILE_METADATA.JSON, _constants.USER_DATA.google).then(function (res) {
      expect(res).toBe("/Users/mike/SouthbankSoftware/provendocs/provendocs/src/server/uploads/proof_certificate_ObjectId('5ba8253f7fd2c7c7c881577d').pdf");
    });
  });
});