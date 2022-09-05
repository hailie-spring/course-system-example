import { getValue } from '../models/redisclient.mjs';
import { commonErrorReturned } from '../lib/utils.mjs'
import { logger } from '../lib/logger.mjs';

export async function authSession(req, res, next) {
    const auth = req.get('Authorization');
    if (!auth) {
        logger.info({ req_id: req._id }, `Authorization is null`);
        return commonErrorReturned(401, req, next);
    }
    const username = req.get('x-cs-username');
    let stored = await getValue(auth);
    if (!stored) {
        logger.info({ req_id: req._id }, `username -> ${username} alredy signout, need to sign in again`);
        return commonErrorReturned(401, req, next);
    }
    try {
        stored = JSON.parse(stored);
        if (stored.username !== username) {
            logger.info({ req_id: req._id }, `stored username -> ${stored.username} not equal with request header x-cs-username -> ${username}`);
            return commonErrorReturned(401, req, next);
        }
    } catch (error) {
        logger.info({ err: error, req_id: req._id }, `json parse stored content -> ${stored} errorF`);
        return commonErrorReturned(500, req, next);
    }

    return next();
}