const {
    NotFoundError,
    UnauthorizedError,
    ForbiddenError
} = require('../../exceptions/exceptions');

const {
    HttpResponseMessageBuilder
} = require('../../models/response/httpResponseMessage');


const errorHandler = (err, req, res, next) => {
    let errorResponse;
    let statusCode;

    switch (err.constructor) {
        case NotFoundError:
            statusCode = 404;
            errorResponse = new HttpResponseMessageBuilder()
                .success(false)
                .error(err.message)
                .msg("Resource not found.")
                .build();
            break;
        case UnauthorizedError:
            statusCode = 401;
            errorResponse = new HttpResponseMessageBuilder()
                .success(false)
                .error(err.message)
                .msg("Unauthorized request.")
                .build();
            break;
        case ForbiddenError:
            statusCode = 403;
            errorResponse = new HttpResponseMessageBuilder()
                .success(false)
                .error(err.message)
                .msg("Forbidden request.")
                .build();
            break;
        default:
            statusCode = 500;
            errorResponse = new HttpResponseMessageBuilder()
                .success(false)
                .error(err.message)
                .msg("An internal server error has occurred.")
                .build();
    }

    res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
