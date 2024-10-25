const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, json } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

const logger = createLogger({
    level: 'info', // Minimum log level
    format: combine(
        timestamp(),    // Zaman damgası ekler
        format.errors({ stack: true }), // Error objeleri için stack ekler
        json(),         // Logları JSON formatında kaydeder
        logFormat       // Custom format kullan
    ),
    transports: [
        new transports.Console(), // Konsola log yazar
        new transports.File({ filename: 'logs/app.log' }) // Dosyaya log yazar
    ]
});

module.exports = logger;
