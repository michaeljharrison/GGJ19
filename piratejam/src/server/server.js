import express from 'express';
import path from 'path';
import winston from 'winston';
import expressWinston from 'express-winston';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { routingLogFormat } from './modules/winston.config.js';

const expressSession = require('express-session');

const app = express();

// Express Config.
app.use(express.static(path.join(__dirname, './public')));
app.use(
  expressWinston.logger({
    transports: [
      new winston.transports.Console({
        level: process.env.PIRATEJAM_LOG_LEVEL || 'debug',
        json: true,
        colorize: true,
        format: routingLogFormat,
      }),
    ],
  }),
);
app.use(cookieParser()); // read cookies (needed for auth)
app.use(expressSession({ secret: 'mySecretKey' }));
app.use(bodyParser.json({ limit: '1600kb' }));
app.use(bodyParser.urlencoded({ limit: '1600kb', extended: true }));
app.use(bodyParser.raw());
app.use(bodyParser.text());

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});
module.exports = app;
