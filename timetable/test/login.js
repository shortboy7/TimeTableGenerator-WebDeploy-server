const userService = require('../domain/user/service/UserService');
const UserDTO = require('./DTO/UserDTO');
const CustomResponse = require('../general/CustomResponse');
const Status = require('../general/Status');

let input = {
    sid: '201511111',
    name: '김동현',
    major: '컴퓨터공학과',
    password: '1234',
    email: ''
};

let userDTO = new UserDTO(input.sid, input.name, input.major, input.password, input.email);

// userService.signUp(userDTO);

let trySuccess = {
    sid : '201511111',
    password : '1234'
}

let tryFail = {
    sid : '201511111',
    password : '1235'
}

userService.logIn(tryFail.sid, tryFail.password).catch(error => {
    console.log(error instanceof Status);
    if (error instanceof Status)
        console.log(CustomResponse.ERROR(error));
    else {
        console.log(CustomResponse.ERROR(Status.SYSTEM_ERROR(error)));
    }
});
