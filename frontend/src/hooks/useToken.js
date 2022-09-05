import { useState } from 'react';
import { TOKEN_NAME } from '../config/config';

export default function useToken() {
    const getToken = () => {
        return localStorage.getItem(TOKEN_NAME);
    };
    const [token, setToken] = useState(getToken());

    const saveToken = (token) => {
        localStorage.setItem(TOKEN_NAME, token);
        setToken(token);
    };

    const emptyToken = () => {
        setToken(null);
    }
    return {
        setToken: saveToken,
        emptyToken,
        token
    }
}