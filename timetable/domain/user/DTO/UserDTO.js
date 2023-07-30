class UserDTO {
    constructor(sid, name, major, password, email){
        this.sid = sid;
        this.name = name;
        this.major = major;
        this.password = password;
        this.email = email;
    }
};

module.exports = UserDTO;