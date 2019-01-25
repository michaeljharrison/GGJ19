"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

var _mongooseFindorcreate = _interopRequireDefault(require("mongoose-findorcreate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

var Schema = _mongoose.default.Schema;
var userSchema = new Schema({
  googleId: String,
  githubId: String,
  name: String,
  provider: String,
  gender: String,
  email: String,
  language: {
    type: String,
    default: 'en_GB'
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  tokenCreatedAt: {
    type: Date,
    default: Date.now
  },
  token: String,
  refreshToken: String
});
userSchema.plugin(_mongooseFindorcreate.default);
module.exports = _mongoose.default.model('User', userSchema);
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(Schema, "Schema", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/models/User.js");
  reactHotLoader.register(userSchema, "userSchema", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/models/User.js");
  leaveModule(module);
})();

;