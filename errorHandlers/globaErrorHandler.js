const logger = require('../logger/logger');
const config = require('../configs/customEnvVariables');

// Middleware to handle custom errors
const globalErrorHandler = (err, req, res, next) => {
    logger.error("Middleware Error Handling:", err); // Log the error details
    const status = err.statusCode || 500;
    const message = err.message || 'Something went wrong';
    const stack = config.nodeEnv === 'development' ? err.stack : {}; // Include stack trace only in development

    res.status(status).json({
        success: false,
        status,
        message,
        stack
    });
};



module.exports = globalErrorHandler;
