const util = require('util');
const crypto = require('crypto');
const randomBytesPromise = util.promisify(crypto.randomBytes);
const pbkdf2Promise = util.promisify(crypto.pbkdf2);

const   REPEATNUM = 47839
const   SALT_LEN = 64
const   KEY_LEN = 64

class CryptoUtil {
    static async  __createSalt() {
        let buf = await randomBytesPromise(SALT_LEN);
        return buf.toString("base64");
    }
    static async createHashedPassword(password) {
        const salt = await CryptoUtil.__createSalt();
        const key = await pbkdf2Promise(password, salt, REPEATNUM, KEY_LEN, "SHA512");
        const hashedPassword = key.toString("base64");
        return {'password': hashedPassword, 'salt' : salt};
    }
    static async verifyPassword(password, userSalt, userPassword) {
        const key = await pbkdf2Promise(password, userSalt, REPEATNUM, KEY_LEN, "SHA512");
        const hashedPassword = key.toString("base64");
        if (hashedPassword == userPassword) return true;
        return false;
    }
};

module.exports = CryptoUtil;