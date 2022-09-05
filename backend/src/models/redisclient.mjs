import Redis from 'ioredis';
import { config } from '../config/config.mjs';

const redis = new Redis(config.redis);

export async function setExValue(key, seconds, value){
    return await redis.setex(key, seconds, value);
}

export async function delValue(key){
    return await redis.del(key);
}

export async function getValue(key){
    return await redis.get(key);
}
