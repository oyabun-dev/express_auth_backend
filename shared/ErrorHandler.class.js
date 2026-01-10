class ErrorHandler extends Error {
    constructor(message, statusCode, origin, error) {
        super(message);
        this.statusCode = statusCode;
        this.origin = origin;
        this.error = error;
    }

    static log(message, origin, error) {
        console.error("[" + origin + "] " + message);
        if (error) console.error(error);
    }

    static throw(message, statusCode, origin, error) {
        ErrorHandler.log(message, origin, error);
        throw new ErrorHandler(message, statusCode, origin, error);
    }

    static create(message, statusCode, origin, error) {
        ErrorHandler.log(message, origin, error);
        return new ErrorHandler(message, statusCode, origin, error);
    }
}

module.exports = ErrorHandler;
