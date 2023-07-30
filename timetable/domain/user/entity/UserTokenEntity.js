class UserTokenEntity{
    constructor(sid, refreshToken){
        this.sid = sid;
        this.refreshToken = refreshToken;
    }
};

module.exports = UserTokenEntity;