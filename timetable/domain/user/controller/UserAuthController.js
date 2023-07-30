const express = require('express');
const CustomResponse = require('../../../general/CustomResponse');

let router = express.Router();
let userService = require('../service/UserService');

router.post('/email', async (req, res) => {
    try{
        await userService.sendMailandSave(req.body);
        res.send(CustomResponse.SUCCESS({}));
    }catch(err) {
        res.send(CustomResponse.ERROR(err));
    }
});

router.post('/email_verify', async (req, res) => {
    try{
        let result = await userService.verifyCode(req.body);
        res.send(CustomResponse.SUCCESS({}));
    }catch(err) {
        res.send(CustomResponse.ERROR(err));
    }
});

router.post('/signup', async (req, res) => {
    try {
        let authToken = await userService.signUp(req.body);
        res.set('authorization', 'Bearer ' + authToken.accessToken);
        res.set('refresh', authToken.refreshToken);
        res.send(CustomResponse.SUCCESS({accessToken:authToken.accessToken}));
    }catch(err) {
        res.send(CustomResponse.ERROR(err));
    }
});

router.post('/login', async (req, res) => {
    try{
        let tokenDTO = await userService.logIn(req.body);
        res.send(CustomResponse.SUCCESS({accessToken:tokenDTO.accessToken}));
    }catch(err) {
        res.send(CustomResponse.ERROR(err));
    }
});

router.get('/reissue', async (req, res) => {
    /**
     * assume req.body has refreshToken, sid
     */
    try{
        let refreshTokenDTO = await userService.verifyRefreshToken(req.body);
        res.set('authorization', 'Bearer ' + refreshTokenDTO.accessToken);
        res.send(CustomResponse.SUCCESS(refreshTokenDTO));
    }catch(err) {
        res.send(CustomResponse.ERROR(err));
    }
});

module.exports = router;