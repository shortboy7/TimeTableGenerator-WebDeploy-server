// require('dotenv').config({path: '../../env'});
const mailConfig = require('../config/mail_config.json');
const Mail = require('nodemailer/lib/mailer');
const Status = require('../general/Status');
const nodemailer = require('nodemailer');

class MailSender {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: mailConfig.SENDER_SERVICE,
            host: mailConfig.SENDER_HOST,
            port: mailConfig.SENDER_PORT,
            auth: {
                user: mailConfig.SENDER_USER,
                pass: mailConfig.SENDER_PASS
            },
            tls: {
                rejectUnauthorized:false
            }            
        });
    }
    generateRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    async sendVerifyEmail(email) {
        const num = this.generateRandom(100000, 999999);
        const mailoptions = {
            from : mailConfig.SENDER_FROM,
            to : email,
            subject: '[TBLMKR] 가입 인증 메일',
            text: "인증 번호 : " + num
        };
        const result = this.transporter.sendMail(mailoptions, (error, info) => {
            if (error) {
                console.log(error);
                throw Status.AUTH_EMAIL_FAILED
            };
            if (info.rejected.length > 0 || info.pending.length > 0) {
                throw Status.AUTH_EMAIL_BLOCKED;
            }
            this.transporter.close();
        });
        return num;
    }
};

module.exports = new MailSender();
