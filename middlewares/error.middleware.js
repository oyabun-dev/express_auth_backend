const ErrorHandler = require("../shared/ErrorHandler.class");

const errorMiddleware = (err, req, res, next) => {
    if (err instanceof ErrorHandler) {
        return res.status(err.statusCode).json({ message: err.message });
    }

    return res.status(500).json({ message: "Internal Server Error" })
}

module.exports = errorMiddleware;