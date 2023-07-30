const UserEntity = require('../entity/UserEntity')
const pool = require('../../../general/ConnectionPool');

class UserRepository{
    findBySid(sid) {
        let sql = 'SELECT * FROM student WHERE sid = ?';
        let param = [sid];
        return pool.excuteQueryPromise(sql, param);
    }
    saveUser(userEntity) {
        let sql = 'INSERT INTO student(sid, name, major, password, e_mail, salt) VALUES(?, ?, ?, ?, ?, ?)';
        let param = [userEntity.sid, userEntity.name, userEntity.major, userEntity.password, userEntity.email, userEntity.salt];
        return pool.excuteQueryPromise(sql, param);
    }
};

module.exports = new UserRepository();

