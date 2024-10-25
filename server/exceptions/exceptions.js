class NotFoundError extends Error {
    constructor(message = "Not Found") {
        super(message);
        this.name = "NotFoundError";
    }
}

class UnauthorizedError extends Error {
    constructor(message = "Unauthorized") {
        super(message);
        this.name = "UnauthorizedError";
    }
}

class ForbiddenError extends Error {
    constructor(message = "Forbidden") {
        super(message);
        this.name = "ForbiddenError";
    }
}

module.exports = {
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
};