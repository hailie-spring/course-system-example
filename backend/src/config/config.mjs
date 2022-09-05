import { readFileSync } from 'node:fs';
export const config = JSON.parse(readFileSync('../development.json').toString('utf-8'));
export const BAD_REQUEST_MESSAGE = 'bad request';
export const INTERNAL_ERROR_MESSAGE = 'internal error';
export const CREDENTIAL_ERROR_MESSAGE = 'credential error';
export const REGISTRATION_INDEX_PREFIX = `registration-system`;
export const LOGIN_INDEX_PREFIX = `login-system`;
export const ATTENDANCE_INDEX_PREFIX = `attendance-system`;