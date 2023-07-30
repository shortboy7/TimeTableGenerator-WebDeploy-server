const userRepository = require('../repository/UserRepository');
const userTokenRepository = require('../repository/userTokenRepository');
const CrpytoUtil = require('../../../util/CryptoUtil');
const UserTokenEntity = require('../entity/UserTokenEntity');
const Status = require('../../../general/Status');

const JWT = require('../../../util/JWT');
const mailer = require('../../../util/Mailer');
const redisUtil = require('../../../util/RedisUtil');

class UserService{
    constructor() {}

    async signUp(dto) {
        let crpytedData = await CrpytoUtil.createHashedPassword(dto.password);
        dto.password = crpytedData.password;
        dto.salt = crpytedData.salt;
        await userRepository.saveUser(dto);
        let newRefreshToken = await JWT.makeRefreshToken();
        let accessToken = await JWT.makeAccessToken(dto.sid);
        await userTokenRepository.saveToken(new UserTokenEntity(dto.sid, newRefreshToken));
        return {accessToken: accessToken, refreshToken: newRefreshToken};
    }

    async sendMailandSave(dto) {
        let num = await mailer.sendVerifyEmail(dto.email);
        await redisUtil.saveEmailCode(dto.email, `${num}`);
        console.log(num);
    }
    
    async verifyCode(dto) {
        let code = await redisUtil.getEmailCode(dto.email);
        if (code != dto.code)
            throw Status.AUTH_VERIFY_CODE_INCORRECT;
        await redisUtil.deleteEmailCode(dto.email);
        return true;
    }

    async logIn(loginDTO) {
        let dbuser = await userRepository.findBySid(loginDTO.sid)
        if (dbuser[0].length <= 0 )
            throw Status.USER_INVALID_SID;
        let result = await CrpytoUtil.verifyPassword(loginDTO.password, dbuser[0][0].salt, dbuser[0][0].password);
        if (!result) throw Status.USER_PASSWORD_INCORRECT;
        let newRefreshToken = await JWT.makeRefreshToken();
        let dbRefreshToken = await userTokenRepository.findBySid(loginDTO.sid);
        if (dbRefreshToken[0].length == 0) {
            await userTokenRepository.saveToken(new UserTokenEntity(dbuser[0][0].sid, newRefreshToken));
        } else {
            await userTokenRepository.updateToken(newRefreshToken);
        }          
        let accessToken = await JWT.makeAccessToken(dbuser[0][0].sid);
        return {accessToken: accessToken, refreshToken: newRefreshToken};
    }

    verifyAccessToken(accessTokenDTO) {
        try{
            return JWT.verifyToken(accessTokenDTO.token);
        }catch (error) {
            if (error.name == 'TokenExpiredError')
                throw new Status.ACCESS_TOKEN_EXPIRED;
            throw Status.SYSTEM_ERROR(error);
        }
    }

    async verifyRefreshToken(refreshTokenDTO) {
        try {
            let refreshTokenRet = await userTokenRepository.findBySid(refreshTokenDTO.sid);
            if (refreshTokenRet[0].length == 0)
                throw new Status.NULL_RESULT;
            if (refreshTokenDTO.refreshToken == refreshTokenRet[0][0].refresh_token)
                throw new Status.TOKEN_INCONSISTENT;
            let verfied = JWT.verifyToken(refreshTokenRet[0][0].refresh_token);
            let newAccessToken = JWT.makeAccessToken(refreshTokenDTO.sid);
            return {accessToken : newAccessToken};
        }catch(error) {
            if (error.name == 'TokenExpiredError')
                throw new Status.REFRESH_TOKEN_EXPIRED;
            else if (error instanceof Status)
                throw error;
            throw new Status.SYSTEM_ERROR(error);
        }
    }

    
};

module.exports = new UserService();