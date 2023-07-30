
class Status{
    static SUCCESS = new Status(true, '요청 성공', 1000);
    static USER_PASSWORD_INCORRECT = new Status(false, '사용자 비밀번호가 잘못되었습니다.', 1001);
    static USER_INVALID_SID = new Status(false, '가입되지 않은 사용자입니다.', 1002);
    static ACCESS_TOKEN_EXPIRED = new Status(false, '만료된 토큰입니다.', 1003);
    static REFRESH_TOKEN_EXPIRED = new Status(false, '만료된 토큰, 재 로그인이 필요합니다.', 1004);
    static TOKEN_INCONSISTENT = new Status(false, '주어진 토큰이 일치하지 않습니다.', 1005);
    static NULL_RESULT = new Status(false, '일치하는 정보가 없습니다.', 1006);
    
    static AUTH_EMAIL_FAILED = new Status(false, '인증 메일 송신이 실패했습니다.', 1007);
    static AUTH_EMAIL_BLOCKED = new Status(false, '인증 메일이 거부되었습니다.', 1008);
    static REDIS_NOT_CONNECTED = new Status(false, 'DB 연결에 실패하였습니다.', 1009);
    static REDIS_EXPIRED_OR_DELETED = new Status(false, '없는 인증코드이거나 만료된 인증코드입니다.', 1010);
    static AUTH_VERIFY_CODE_INCORRECT = new Status(false, '인증 코드가 잘못되었습니다.', 1011);


    static SYSTEM_ERROR (system_error) {
        return new Status(false, system_error, 9999);
    }
    constructor(isSuccess, message, code) {
        this.isSuccess = isSuccess;
        this.message = message;
        this.code = code;
    }
};

module.exports = Status;