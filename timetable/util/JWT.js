const jwt = require('jsonwebtoken');
const util = require('util');
const SECRET = 'JjiwjwojjongJjwWT1132u4SE123-0KE0N';
const signPromise = util.promisify(jwt.sign);


class JWT{
    static async makeAccessToken(sid) {
        let ret = null;
        await signPromise({sid : sid}, SECRET, {expiresIn : '1h'}).then(token => {
            ret = token;
        });
        return ret;
    }
    static async makeRefreshToken() {
        let ret = null;
        await signPromise({}, SECRET, {expiresIn : '14 days'}).then(token => {
            ret = token;
        });
        return ret;
    }
    static verifyToken(token) {
        return jwt.verify(token, SECRET);
    }
};

module.exports = JWT;