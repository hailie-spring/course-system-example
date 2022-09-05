'use strict';

import createError from 'http-errors';
import { BAD_REQUEST_MESSAGE, INTERNAL_ERROR_MESSAGE, CREDENTIAL_ERROR_MESSAGE } from '../config/config.mjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
dayjs.extend(utc);

export function generateIndexPattern(source, startTime, endTime) {
    const days = dayjs.utc(endTime).diff(dayjs.utc(startTime), 'day');
    let indexes = null;
    if (days >= 90) {
        indexes = [`${source}-*`]
    } else {
        indexes = [];
        for (let i = 0; i <= days; i++) {
            indexes.push(`${source}-${dayjs.utc(startTime).add(i, 'day').format('YYYY.MM.DD')}`);
        }
    }
    return indexes;
}

const NS_PER_SEC = 1e9;
const MS_PER_NS = 1e6;


export function hrTimeDurationInMs(secondDiff, nanoSecondDiff) {
    if (!secondDiff && !nanoSecondDiff) {
        return 0;
    }
    const diffInNanoSecond = secondDiff * NS_PER_SEC + nanoSecondDiff;
    return Math.round(diffInNanoSecond / MS_PER_NS);
}

export function commonErrorReturned(statusCode, req, next) {
    let message = BAD_REQUEST_MESSAGE;
    if (statusCode === 400) {
        message = BAD_REQUEST_MESSAGE;
    } else if(statusCode === 401){
        message = CREDENTIAL_ERROR_MESSAGE;
    }
    else if (statusCode === 500) {
        message = INTERNAL_ERROR_MESSAGE;
    }
    return next(createError(statusCode, message));
}