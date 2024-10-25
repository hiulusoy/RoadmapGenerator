const {
    HttpResponseMessageBuilder
} = require('../models/response/httpResponseMessage');

function sendResponse(res, data, totalCount = null) {
    const response = new HttpResponseMessageBuilder()
        .success(true)
        .responseData(data)
        .totalCount(totalCount || data.length)
        .build();
    return res.status(200).json(response);
}

function sendErrorResponse(res, error, statusCode = 500) {
    const response = new HttpResponseMessageBuilder()
        .success(false)
        .msg(error)
        .error(error)
        .build();
    return res.status(statusCode).json(response);
}


// In controllerUtil.js
module.exports = {
    sendResponse,
    sendErrorResponse
};
