"use strict";

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _winston = _interopRequireDefault(require("winston"));

var _expressWinston = _interopRequireDefault(require("express-winston"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));

var _winstonConfig = require("./modules/winston.config.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

var expressSession = require('express-session');

var _require = require('mongodb'),
    MongoClient = _require.MongoClient;

var swaggerDocument = require("./swagger.json");

var app = (0, _express.default)();
var jwtSecret = process.env.JWT_SECRET || 'provendbjwtsecret';

var logger = _winston.default.createLogger({
  transports: [new _winston.default.transports.Console({
    level: process.env.PROVENDOCS_LOG_LEVEL || 'debug',
    json: true,
    colorize: true,
    format: _winstonConfig.generalFormat
  })]
}); // Initial check to make sure we can connect to Mongodb.
// $FlowFixMe


MongoClient.connect(process.env.PROVENDOCS_URI, {
  useNewUrlParser: true,
  poolSize: 1
}).then(function () {
  logger.log({
    level: 'info',
    message: 'Connected to MongoDB'
  });
  logger.log({
    level: 'info',
    message: 'ProvenDocs is now running.'
  });
  logger.log({
    level: 'info',
    message: 'Config Below:',
    runningOnPort: process.env.PROVENDOCS_PORT || 8888,
    URI: process.env.PROVENDOCS_URI,
    logLevel: process.env.PROVENDOCS_LOG_LEVEL || 'debug'
  });
}).catch(function (error) {
  return logger.log({
    level: 'err',
    message: 'Failed to connect to MongoDB.',
    error: error
  });
}); // Express Config.

app.set('jwtSecret', jwtSecret);
app.use(_express.default.static(_path.default.join(__dirname, './public')));
app.use('/api-docs', _swaggerUiExpress.default.serve, _swaggerUiExpress.default.setup(swaggerDocument));
app.use(_expressWinston.default.logger({
  transports: [new _winston.default.transports.Console({
    level: process.env.PROVENDOCS_LOG_LEVEL || 'debug',
    json: true,
    colorize: true,
    format: _winstonConfig.routingLogFormat
  })]
}));
app.use((0, _cookieParser.default)()); // read cookies (needed for auth)

app.use(expressSession({
  secret: 'mySecretKey'
}));
app.use(_bodyParser.default.json({
  limit: '1600kb'
}));
app.use(_bodyParser.default.urlencoded({
  limit: '1600kb',
  extended: true
}));
app.use(_bodyParser.default.raw());
app.use(_bodyParser.default.text()); // API Routes.

require("./routes/authRoutes.js")(app);

require("./routes/utilRoutes.js")(app);

require("./routes/fileRoutes.js")(app);

require("./routes/uploadRoutes.js")(app);

require("./routes/proofRoutes.js")(app);

require("./routes/shareRoutes.js")(app);

app.get('*', function (req, res) {
  res.sendFile(_path.default.join(__dirname, './public/index.html'));
});
module.exports = app;
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(app, "app", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/server.js");
  reactHotLoader.register(jwtSecret, "jwtSecret", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/server.js");
  reactHotLoader.register(logger, "logger", "/Users/mike/SouthbankSoftware/provendb/provendocs/src/server/server.js");
  leaveModule(module);
})();

;