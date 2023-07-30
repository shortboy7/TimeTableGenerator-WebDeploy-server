const redis = require('redis');
const redisclient = redis.createClient();
const Status = require('../general/Status');

const EXPIRE_SECONDS = 60 * 5;

class RedisUtil {
    constructor() {
        this.client = redis.createClient();
        this.client.on('connect', () => {
            console.log('redis connected');
        });
        this.client.on('error', (err) => {
            console.log('redis error : ', err);
        });
        this.client.connect();
    }
    async saveEmailCode(email, code) {
        if (!this.client.isReady) throw Status.REDIS_NOT_CONNECTED;
        await this.client.set(email, code);
        await this.client.expire(email, EXPIRE_SECONDS);
    }
    async getEmailCode(email) {
        if (!this.client.isReady) throw Status.REDIS_NOT_CONNECTED;
        const existed = await this.client.exists(email);
        if (!existed) throw Status.REDIS_EXPIRED_OR_DELETED;
        let code = await this.client.get(email);
        return code;
    }
    async deleteEmailCode(email) {
        if (!this.client.isReady) throw Status.REDIS_NOT_CONNECTED;
        try{
            this.client.watch(email).then(async () =>{
                const existed = await this.client.exists(email);
                if (existed) {
                    await this.client.del(email);
                }
            });
        }catch(err) {
            console.error(err);
        }
    }
};

let redisUtil = new RedisUtil();

module.exports = redisUtil;