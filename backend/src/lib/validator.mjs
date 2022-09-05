import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';
import { Buffer } from 'node:buffer';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
dayjs.extend(utc);
import { logger } from './logger.mjs';
const TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss[Z]';
import { commonErrorReturned } from './utils.mjs'
import { REGISTRATION_INDEX_PREFIX, ATTENDANCE_INDEX_PREFIX } from '../config/config.mjs';
import qs from 'qs';

export function validateSearchBody(req, res, next) {
    logger.info({ req_id: req._id, msg: `receive query body: ${JSON.stringify(req.query)}` });
    const { source, nextPageToken } = req.query;
    if (!source || ![REGISTRATION_INDEX_PREFIX, ATTENDANCE_INDEX_PREFIX].includes(source)) {
        logger.warn({ req_id: req._id, msg: `source -> ${source} not match rule: in [${REGISTRATION_INDEX_PREFIX}, ${ATTENDANCE_INDEX_PREFIX}]` });
        return commonErrorReturned(400, req, next);
    }
    if (nextPageToken) {
        try {
            if (!checkBase64(nextPageToken)) {
                logger.warn({ req_id: req._id, msg: `nextPageToken -> ${nextPageToken} not match rule: base64 format` });
                return commonErrorReturned(400, req, next);
            }
            req.query = qs.parse(Buffer.from(nextPageToken, 'base64'));
        } catch (err) {
            logger.warn({ req_id: req._id, err, msg: `nextPageToken -> ${nextPageToken} not match rule: qs parse format` });
            return commonErrorReturned(400, req, next);
        }
    }
    const { size, courseName, fieldName, fieldValue, search_after } = req.query;
    let { startTime, endTime } = req.query;
    if (!size) {
        req.query.size = 20;
    } else if (!checkOnlyNumber(size)) {
        logger.warn({ req_id: req._id, msg: `size -> ${size} not match rule: number` });
        return commonErrorReturned(400, req, next);
    } else {
        req.query.size = Number(size);
    }
    if (!startTime) {
        startTime = dayjs.utc().add(-180, 'day');
        req.query.startTime = startTime.format(TIME_FORMAT);
    } else if (!checkIsoDate(startTime)) {
        logger.warn({ req_id: req._id, msg: `startTime -> ${startTime} not match rule: ISO format` });
        return commonErrorReturned(400, req, next);
    } else {
        startTime = dayjs.utc(startTime);
        req.query.startTime = startTime.format(TIME_FORMAT);
    }
    if (!endTime) {
        endTime = dayjs.utc();
        req.query.endTime = endTime.format(TIME_FORMAT);
    } else if (!checkIsoDate(endTime)) {
        logger.warn({ req_id: req._id, msg: `endTime -> ${endTime} not match rule: ISO format` });
        return commonErrorReturned(400, req, next);
    } else {
        endTime = dayjs.utc(endTime);
        req.query.endTime = endTime.format(TIME_FORMAT);
    }
    const lengthLimit = [
        { key: 'courseName', value: courseName, length: 20 },
        { key: 'fieldName', value: fieldName, length: 20 },
        { key: 'fieldValue', value: fieldValue, length: 80 }];
    for (const element of lengthLimit) {
        if (element.value) {
            if (element.length > element.length) {
                logger.warn({ req_id: req._id, msg: `${element.key} -> ${element.value} not match rule: length less than ${element.length}` });
                return commonErrorReturned(400, req, next);
            }
        }
    }
    if (search_after) {
        try {
            req.query['search_after'] = JSON.parse(search_after);
        } catch (err) {
            logger.warn({ req_id: req._id, msg: `search_after -> ${search_after} not match rule: JSON format` });
            return commonErrorReturned(400, req, next);
        }
    }
    next();
}

function checkBase64(value) {
    if (value && Buffer.from(value, 'base64').toString('base64') === value) {
        return true;
    }
    return false;
}

function checkIsoDate(date) {
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/.test(date)) {
        return false;
    }
    return true;
}

export function validateLoginOperation(req, res, next) {
    // logger.info({ req_id: req._id, msg: `receive post body: ${JSON.stringify(req.body)}` });
    if (!req.body || Object.keys(req.body).length === 0) {
        logger.warn({ req_id: req._id, msg: 'request body content not match rule: not empty dict' });
        return commonErrorReturned(400, req, next);
    }
    const { telephoneNumber, password, email } = req.body;
    if (email) {
        if (!validator.isEmail(email)) {
            logger.warn({ req_id: req._id, msg: `email -> ${email} not match rule: not email format` });
            return commonErrorReturned(400, req, next);
        }
    }
    if (!telephoneNumber || telephoneNumber.length !== 14 && telephoneNumber.length !== 11) {
        logger.warn({ req_id: req._id, msg: `telephoneNumber -> ${telephoneNumber} not match rule: length is 11 or 14` });
        return commonErrorReturned(400, req, next);
    }
    if (!password) {
        logger.warn({ req_id: req._id, msg: `password -> ${password} not match rule: not null` });
        return commonErrorReturned(400, req, next);
    }
    return next();
}

export function validateLoginUpdate(req, res, next) {
    const { newPassword } = req.body;
    if (!newPassword) {
        logger.warn({ req_id: req._id, msg: `newPassword -> ${newPassword} not match rule: not null` });
        return commonErrorReturned(400, req, next);
    }
    return next();
}

export function validateRegistrationInsert(req, res, next) {
    logger.info({ req_id: req._id, msg: `receive post body: ${JSON.stringify(req.body)}` });
    if (!req.body || Object.keys(req.body).length === 0) {
        logger.warn({ req_id: req._id, msg: 'request body content not match rule: not empty dict' });
        return commonErrorReturned(400, req, next);
    }
    const { telephoneNumber, parentName, studentName, birthdate, courseName, registrationFee, totalQuantity, contractNumber, gmtExpired } = req.body;
    const NOT_NULL_KEYS = ['telephoneNumber', 'parentName', 'studentName', 'courseName', 'registrationFee', 'totalQuantity'];
    for (const _key of NOT_NULL_KEYS) {
        if (!req.body[_key]) {
            logger.warn({ req_id: req._id, msg: `${_key} -> ${req.body[_key]} not match rule: not null value` });
            return commonErrorReturned(400, req, next);
        }
    }
    if (telephoneNumber.length !== 14 && telephoneNumber.length !== 11) {
        // telephoneNumber format: '+86-000-0000-0000' or '000-0000-0000'
        logger.warn({ req_id: req._id, msg: `telephoneNumber -> ${telephoneNumber} not match rule: length is 11 or 14` });
        return commonErrorReturned(400, req, next);
    }
    if (parentName.length > 20) {
        logger.warn({ req_id: req._id, msg: `parentName -> ${parentName} not match rule: length is less than 10` });
        return commonErrorReturned(400, req, next);
    }
    if (studentName.length > 20) {
        logger.warn({ req_id: req._id, msg: `studentName -> ${studentName} not match rule: length is less than 10` });
        return commonErrorReturned(400, req, next);
    }
    if (birthdate) {
        if (!/\d{4}-\d{2}-\d{2}/.test(birthdate)) {
            logger.warn({ req_id: req._id, msg: `birthDate -> ${birthdate} not match rule: \d{4}-\d{2}-\d{2}` });
            return commonErrorReturned(400, req, next);
        }
    }
    if (courseName.length > 20) {
        logger.warn({ req_id: req._id, msg: `courseName -> ${courseName} not match rule: length is less than 10` });
        return commonErrorReturned(400, req, next);
    }
    if (!checkOnlyNumber(registrationFee)) {
        logger.warn({ req_id: req._id, msg: `typeof registrationFee -> ${typeof registrationFee} not match rule: number` });
        return commonErrorReturned(400, req, next);
    }
    req.body.registrationFee = Number(registrationFee);
    if (!checkOnlyNumber(totalQuantity)) {
        logger.warn({ req_id: req._id, msg: `typeof totalQuantity -> ${typeof totalQuantity} not match rule: number` });
        return commonErrorReturned(400, req, next);
    }
    req.body.totalQuantity = Number(totalQuantity);
    if (!contractNumber) {
        req.body.contractNumber = `${new Date().getTime()}-${uuidv4()}`;
    }
    if (!gmtExpired) {
        req.body.gmtExpired = dayjs.utc().add(3, 'year').format(TIME_FORMAT);
    }
    req.body.gmtCreated = dayjs.utc().format(TIME_FORMAT);
    req.body.consumedQuantity = 0;
    next();
}

export function validateAttendancePatch(req, res, next) {
    logger.info({ req_id: req._id, msg: `receive post body: ${JSON.stringify(req.body)}` });
    if (!req.body || Object.keys(req.body).length === 0) {
        logger.warn({ req_id: req._id, msg: 'request body content not match rule: not empty dict' });
        return commonErrorReturned(400, req, next);
    }
    const { docId } = req.body;
    const NOT_NULL_KEYS = ['docId', 'evaluation'];
    for (const _key of NOT_NULL_KEYS) {
        if (!req.body[_key]) {
            logger.warn({ req_id: req._id, msg: `${_key} -> ${req.body[_key]} not match rule: not null value` });
            return commonErrorReturned(400, req, next);
        }
    }
    if (!validateUuid(docId)) {
        logger.warn({ req_id: req._id, msg: `docId -> ${docId} not match rule: uuid format` });
        return commonErrorReturned(400, req, next);
    }
    next();
}

export function validateAttendanceInsert(req, res, next) {
    logger.info({ req_id: req._id, msg: `receive post body: ${JSON.stringify(req.body)}` });
    if (!req.body || Object.keys(req.body).length === 0) {
        logger.warn({ req_id: req._id, msg: 'request body content not match rule: not empty dict' });
        return commonErrorReturned(400, req, next);
    }
    const { docId, schoolDate, startSchoolTime, endSchoolTime } = req.body;
    const NOT_NULL_KEYS = ['contractNumber', 'telephoneNumber', 'studentName', 'courseName', 'schoolDate', 'startSchoolTime', 'endSchoolTime'];
    for (const _key of NOT_NULL_KEYS) {
        if (!req.body[_key]) {
            logger.warn({ req_id: req._id, msg: `${_key} -> ${req.body[_key]} not match rule: not null value` });
            return commonErrorReturned(400, req, next);
        }
    }
    if (docId) {
        if (!validateUuid(docId)) {
            logger.warn({ req_id: req._id, msg: `docId -> ${docId} not match rule: uuid format` });
            return commonErrorReturned(400, req, next);
        }
    }
    if (!/\d{4}-\d{2}-\d{2}/.test(schoolDate)) {
        logger.warn({ req_id: req._id, msg: `schoolDate -> ${schoolDate} not match rule: \d{4}-\d{2}-\d{2}` });
        return commonErrorReturned(400, req, next);
    }
    if (!/\d{2}:\d{2}/.test(startSchoolTime)) {
        logger.warn({ req_id: req._id, msg: `startSchoolTime -> ${startSchoolTime} not match rule: \d{2}:\d{2}` });
        return commonErrorReturned(400, req, next);
    }
    if (!/\d{2}:\d{2}/.test(endSchoolTime)) {
        logger.warn({ req_id: req._id, msg: `endSchoolTime -> ${endSchoolTime} not match rule: \d{2}:\d{2}` });
        return commonErrorReturned(400, req, next);
    }
    req.body.gmtCreated = dayjs.utc().format(TIME_FORMAT);
    next();
}

function checkOnlyNumber(val) {
    return /^\d+$/.test(val);
}

function validateUuid(id) {
    if ((/^[0-9a-zA-Z-]{36}$/).test(id)) {
        return true;
    } else {
        return false;
    }
}