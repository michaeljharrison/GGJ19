import winston from 'winston';
// eslint-disable-next-line
import colors from 'colors';
const LOG_TYPE = process.env.PIRATEJAM_LOG_TYPE || 'prod';
let baseFormat;
if (LOG_TYPE === 'prod') {
  baseFormat = winston.format.combine(winston.format.timestamp());
} else {
  baseFormat = winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp(),
    winston.format.align(),
  );
}

export const routingLogFormat = winston.format.combine(
  baseFormat,
  LOG_TYPE === 'prod'
    ? winston.format.label({ label: 'ROUTE' })
    : winston.format.label({ label: 'ROUTE'.magenta }),
  winston.format.printf((info) => {
    const {
      timestamp, level, message, code, label, ...args
    } = info;

    const ts = timestamp.slice(0, 19).replace('T', ' ');
    if (LOG_TYPE === 'prod') {
      return `{"code": ${code
        || '"none"'}, "message": "${message}", "ts": "${ts}", "label": "${label}", "level": "${level}", "args": ${
        Object.keys(args).length ? JSON.stringify(args, null, null) : '"none"'
      }}`;
    }
    return `${ts.yellow} - [${label}] - [${level}]: ${message} \n${
      Object.keys(args).length ? JSON.stringify(args, null, 2) : ''
    }`;
  }),
);
