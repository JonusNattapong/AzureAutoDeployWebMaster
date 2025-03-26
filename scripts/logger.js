const winston = require('winston');
const { format } = winston;

// Custom format for deployment logs
const deploymentFormat = format.printf(({ level, message, timestamp }) => {
  const icon = {
    info: '📝',
    warn: '⚠️',
    error: '❌',
    debug: '🔍',
    success: '✅'
  }[level] || '🔄';
  
  return `${timestamp} ${icon} ${level.toUpperCase()}: ${message}`;
});

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    deploymentFormat
  ),
  transports: [
    // Console output
    new winston.transports.Console(),
    // File output
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/deployment.log' 
    })
  ]
});

// Add success level
logger.success = (message) => {
  logger.log({
    level: 'success',
    message
  });
};

// Export logger instance
module.exports = logger;