class HttpResponseMessage {
    constructor({
        success = false,
        error = '',
        msg = '',
        token = '',
        refreshToken = '',
        totalCount = 0,
        timeout = 0,
        responseData = null
    }) {
        this.success = success;
        this.error = error;
        this.msg = msg;
        this.token = token;
        this.refreshToken = refreshToken;
        this.totalCount = totalCount;
        this.timeout = timeout;
        this.responseData = responseData;
    }
}


class HttpResponseMessageBuilder {
    constructor() {
        this.config = {};
    }

    success(success) {
        this.config.success = success;
        return this;
    }

    error(error) {
        this.config.error = error;
        return this;
    }

    msg(msg) {
        this.config.msg = msg;
        return this;
    }

    token(token) {
        this.config.token = token;
        return this;
    }

    refreshToken(refreshToken) {
        this.config.refreshToken = refreshToken;
        return this;
    }

    totalCount(totalCount) {
        this.config.totalCount = totalCount;
        return this;
    }

    timeout(timeout) {
        this.config.timeout = timeout;
        return this;
    }

    responseData(responseData) {
        this.config.responseData = responseData;
        return this;
    }

    build() {
        return new HttpResponseMessage(this.config);
    }
}

module.exports = {
    HttpResponseMessage,
    HttpResponseMessageBuilder
};