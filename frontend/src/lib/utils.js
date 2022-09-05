import axios from 'axios';
import { HTTP_REQUEST_TIMEOUT, TOKEN_NAME, USERNAME_STORE } from '../config/config';

export async function postFormValues(path, data, method = 'post') {
    const requestConfig = {
        method,
        url: path,
        timeout: HTTP_REQUEST_TIMEOUT,
        data
    };
    const token = localStorage.getItem(TOKEN_NAME);
    const username = localStorage.getItem(USERNAME_STORE);
    let headers = null;
    if (token && username) {
        headers = {
            Authorization: token,
            'x-cs-username': username
        }
    }
    if (headers) {
        requestConfig.headers = headers;
    }
    const response = await axios(requestConfig);
    return response;
}

export async function getSearchQuery(path, params) {
    const response = await axios({
        method: 'get',
        url: path,
        timeout: HTTP_REQUEST_TIMEOUT,
        headers: {
            Authorization: localStorage.getItem(TOKEN_NAME),
            'x-cs-username': localStorage.getItem(USERNAME_STORE)
        },
        params
    });
    return response;
}

export function getTimeFormat(date) {
    return (date.toISOString().split('T')[1].split(':').slice(0, 2)).join(':');
}

export function getDateFormat(date) {
    return date.toISOString().split('T')[0];
}

export function getISOFormat(date) {
    return date.toISOString().split('.')[0] + 'Z';
}
export function addDays(days) {
    const date = new Date();
    return date.setDate(date.getDate() + days);
}

export function logoutAction() {

}