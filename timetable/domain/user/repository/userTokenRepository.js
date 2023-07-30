const UserTokenEntity = require('../entity/UserTokenEntity')
const pool = require('../../../general/ConnectionPool');

class UserTokenRepository{
    findBySid(sid) {
        let sql = 'SELECT * FROM student_tokens WHERE sid = ?';
        let param = [sid];
        return pool.excuteQueryPromise(sql, param);
    }
    saveToken(userTokenEntity) {
        let sql = 'INSERT INTO student_tokens(sid, refresh_token) VALUES(?, ?)';
        let param = [userTokenEntity.sid, userTokenEntity.refreshToken];
        return pool.excuteQueryPromise(sql, param);
    }
    updateToken(userTokenEntity) {
        let sql = 'UPDATE student_tokens SET refresh_token = ? WHERE sid = ?';
        let param = [userTokenEntity.refreshToken, userTokenEntity.sid];
        return pool.excuteQueryPromise(sql, param);
    }
};

module.exports = new UserTokenRepository();

