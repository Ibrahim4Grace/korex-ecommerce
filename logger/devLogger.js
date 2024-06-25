const {format, createLogger, transports} = require('winston');
const {timestamp, combine, printf, errors} = format;


function buildDevLogger () {

    const logFormat = printf(({ level, message, timestamp, stack }) => {
        return `${timestamp} ${level}: ${stack || message}`;
    });
      
    return createLogger({
       
        format: combine(
          format.colorize(), 
          timestamp({format: 'YYYY-MM-DD HH:mm:ss' }), 
          errors({stack: true}),
          logFormat
        ), 
        defaultMeta: { meta1: 'value1' },
        transports: [
            new transports.Console({ level: 'debug'}),
            new transports.File({
                level: 'warn',
                filename: 'logger/logsWarnings.log'
            }),
            new transports.File({
                level: 'error',
                filename: 'logger/logsErrors.log'
            }),
        ],
    });
}



module.exports = buildDevLogger;


