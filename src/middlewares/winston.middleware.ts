import { utilities, WinstonModule } from 'nest-winston';
import winstonDaily from 'winston-daily-rotate-file';
import * as winston from 'winston';
import moment from 'moment-timezone';

const appendTimestamp = winston.format((info, opts) => {
  if (opts.tz) {
    info.timestamp = moment()
      .tz(opts.tz)
      .format('YYYY-MM-DD HH:mm:ss.SSS');
  }
  return info;
});

const dailyOptions = {
  level: 'http',
  datePattern: 'YYYY-MM-DD',
  dirname: './logs',
  filename: 'my-image-sns.log.%date%',
  maxFiles: 30,
  zippedArchive: true,
  colorize: false,
  handleException: true,
  json: false,
};

export const winstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'silly',
      format: winston.format.combine(utilities.format.nestLike('my-image-sns')),
    }),

    new winstonDaily(dailyOptions),
  ],

  format: winston.format.combine(
    appendTimestamp({ tz: 'Asia/Seoul' }),
    // winston.format.json(),
    winston.format.printf(info => {
      return `${info.timestamp} - ${info.level} [${process.pid}]: ${info.message}`;
    }),
  ),
});
