import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { searchDocs, updateDoc, createDoc } from '../models/esclient.mjs'
import { searchExistRegistrationDSL } from '../services/esdslservice.mjs'
import { commonErrorReturned } from '../lib/utils.mjs'
import { logger } from '../lib/logger.mjs';
import { LOGIN_INDEX_PREFIX } from '../config/config.mjs';
import { setExValue, delValue } from '../models/redisclient.mjs';

function generateSavedPassword(password) {
    return crypto.createHash('sha256')
        .update(password)
        .digest('hex');
}

async function checkExistUser(parameters, req) {
    const dslQuery = searchExistRegistrationDSL(parameters);
    logger.info({ req_id: req._id, msg: `query dsl: ${JSON.stringify(dslQuery)}` });
    const response = await searchDocs(`${LOGIN_INDEX_PREFIX}-*`, dslQuery);
    const hits = response['hits']['hits'];
    if (hits.length === 0) {
        return false;
    } else {
        req.body._index = hits[0]._index;
        req.body._id = hits[0]._id;
    }
    return true;
}
const SIGNIN_TOKEN_CHARS = '_-abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function generateSignInToken() {
    return new Array(10).fill(0).map(() => SIGNIN_TOKEN_CHARS[Math.floor(Math.random() * SIGNIN_TOKEN_CHARS.length)]).join('');
}

export async function checkSignUpState(req, res, next) {
    const parameters = {
        telephoneNumber: req.body.telephoneNumber
    }
    try {
        if (await checkExistUser(parameters, req)) {
            logger.warn({ req_id: req._id, msg: `username -> ${req.body.telephoneNumber} already taken, sign up failed` });
            return commonErrorReturned(400, req, next);
        }
        next();
    } catch (err) {
        logger.error({ err, req_id: req._id, msg: `check sign in state error` });
        return commonErrorReturned(500, req, next);
    }
}

export async function insertLoginInfo(req, res, next) {
    const index = `${LOGIN_INDEX_PREFIX}-${new Date().toISOString().split('T')[0]}`;
    const docId = uuidv4();
    try {
        const body = {
            email: req.body.email,
            telephoneNumber: req.body.telephoneNumber,
            password: generateSavedPassword(req.body.password),
            docId
        }
        logger.info({ req_id: req._id, msg: `create login record ${JSON.stringify(body)} by docId -> ${docId}` });
        const response = await createDoc(docId, index, body);
        logger.info({ req_id: req._id, msg: `create login record success by docId -> ${docId} to index -> ${index} with result -> ${response.result}` });
        next();
    } catch (err) {
        logger.error({ err: err, req_id: req._id }, `create docId -> ${docId} to es index -> ${index} error`);
        return commonErrorReturned(500, req, next);
    }
}

export async function updateLoginInfo(req, res, next) {
    const docId = req.body._id;
    const indexName = req.body._index;
    try {
        const body = {
            script: {
                source: 'ctx._source.password = params.password',
                lang: 'painless',
                params: {
                    password: generateSavedPassword(req.body.newPassword)
                }
            }
        }
        const response = await updateDoc(docId, indexName, body);
        logger.info({ req_id: req._id, msg: `update login password success by docId -> ${docId} to index -> ${indexName} with result -> ${response.result}` });
        res.send({
            code: 200,
            message: 'update login password success'
        });
        next();
    } catch (err) {
        logger.error({ err, req_id: req._id }, `update login info to docId -> ${docId} to es index -> ${indexName} error`);
        return commonErrorReturned(500, req, next);
    }
}

export async function checkSignInState(req, res, next) {
    const parameters = {
        telephoneNumber: req.body.telephoneNumber,
        password: generateSavedPassword(req.body.password)
    }
    try {
        if (await checkExistUser(parameters, req)) {
            next();
        } else {
            logger.warn({ req_id: req._id, msg: `not found match doc with username -> ${req.body.telephoneNumber} and password -> ${parameters.password}` });
            return commonErrorReturned(401, req, next);
        }

    } catch (err) {
        logger.error({ err, req_id: req._id, msg: `check sign in state error` });
        return commonErrorReturned(500, req, next);
    }
}

export async function destroySession(req, res, next) {
    try {
        await delValue(req.get('Authorization'));
        res.send({
            message: 'signout success'
        });
    } catch (error) {
        logger.error({ err, req_id: req._id }, `destroy session error`);
        return commonErrorReturned(500, req, next);
    }
}

export async function returnSignInResult(req, res, next) {
    const token = generateSignInToken();
    setExValue(token, 86400, JSON.stringify({ username: req.body.telephoneNumber }))
    res.send({
        token
    });
    next();
}