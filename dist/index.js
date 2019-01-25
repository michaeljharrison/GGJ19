"use strict";

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

/*
 * @Author: Wahaj Shamim <wahaj>
 * @Date:   2018-11-20T16:34:37+11:00
 * @Email:  wahaj@southbanksoftware.com
 * @Last modified by:   wahaj
 * @Last modified time: 2018-11-20T16:34:52+11:00
 *
 * Copyright (c) 2018 Southbank Software
 */
var app = require("./server");

var port = process.env.PROVENDOCS_PORT || 8888;
app.listen(port, function () {
  console.log('__________________________________________________');
  console.log('\n\n ___                        ___');
  console.log('| _ \\_ _ _____ _____ _ _   |   \\ ___  __ ___   ');
  console.log("|  _/ '_/ _ \\ V / -_) ' \\  | |) / _ \\/ _(_-<   ");
  console.log('|_| |_| \\___/\\_/\\___|_||_| |___/\\___/\\__/__/__ ');
  console.log('| |__ _  _  | _ \\_ _ _____ _____ _ _ |   \\| _ )');
  console.log("| '_ \\ || | |  _/ '_/ _ \\ V / -_) ' \\| |) | _ \\");
  console.log('|_.__/\\_, | |_| |_| \\___/\\_/\\___|_||_|___/|___/');
  console.log('      |__/                                     \n\n');
  console.log('__________________________________________________');
  console.log('');
  console.log("Provendocs Server now Running at localhost:".concat(port));
  console.log('');
  console.log('       "You can\'t argue with the Blockchain."       ');
  console.log('');
  console.log('Version 0.1                     Southbank Software');
  console.log('');
  console.log('__________________________________________________');
  console.log('\n\n');
});
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(port, "port", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/index.js");
  leaveModule(module);
})();

;