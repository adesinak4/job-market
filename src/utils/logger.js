const { createLogger, transports, format } = require('winston');
const { combine, timestamp, printf } = format;
const fs = require('fs');

if (!transports) {
    throw new Error('Error: Winston transports module not found');
}

const currentDate = new Date();
const options = { timeZone: 'Africa/Lagos', timeZoneName: 'short', hour12: false };
const formattedDateTime = currentDate.toLocaleString('en-US', options);

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} - ${level}: ${message}`;
});

// Define the Winston logger
const logger = createLogger({
    transports: [
        // File transport for local logs
        new transports.File({ filename: 'logs/logs.log', format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat) }),
        new transports.Console(),
    ],
});

module.exports = logger;
