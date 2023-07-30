const express = require('express');
const userService = require('../service/UserService');

const Status = require('../../../general/Status');
const CustomResponse = require('../../../general/CustomResponse');

module.exports = function verify(req, res, next) {
    try{
        const token = req.headers.authorization.split('Bearer ')[1];
        let tokenData = userService.verifyAccessToken({token:token});
        req.body.sid = tokenData;
        next();
    }catch(err) {
        console.log(err);
        res.send(CustomResponse.ERROR(err));
    }
}
