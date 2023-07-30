const Status = require('./Status');

class CustomResponse {
    static ERROR(errorStatus) {
        return new CustomResponse(
            errorStatus.isSuccess,
            errorStatus.message,
            errorStatus.code,
            null
        );
    }

    static SUCCESS(object) {
        if (object == null) throw "object cannot be null";
        return new CustomResponse(
            Status.SUCCESS.isSuccess,
            Status.SUCCESS.message,
            Status.SUCCESS.code,
            object
        );            
    }
    constructor(isSuccess, message, code, result = null) {
        this.isSuccess = isSuccess;
        this.message = message;
        this.code = code;
        if (result != null) {
            this.result = result;
        }
    }
};

module.exports = CustomResponse;