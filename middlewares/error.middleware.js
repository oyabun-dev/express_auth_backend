const ErrorHandler = require("../shared/ErrorHandler.class");

const errorMiddleware = (err, req, res, next) => {
    const message = err.message || "Internal Server Error";
    const statusCode = err.statusCode || 500;
    const origin = err.origin || "Unknown";
    const error = err.error || err;

    if (!(err instanceof ErrorHandler)) {
        ErrorHandler.log(message, origin, error);
    }

    return res.status(statusCode).json({ success: false, message: message, error: error });
}

module.exports = errorMiddleware;