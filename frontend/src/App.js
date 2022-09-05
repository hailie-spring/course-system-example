import React, { useState, useEffect } from 'react';
import Navigation from './pages/Navigation';
import RegisterForm from './pages/RegisterForm';
import './App.css'
import SearchForm from './pages/SearchForm';
import AttendanceForm from './pages/AttendanceForm';
import LoginForm from './pages/LoginForm';
import SettingForm from './pages/SettingForm';
import SessionTimeout from './components/SessionTimeout';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import useToken from './hooks/useToken';

function App(props) {
    const [open, setOpen] = useState(false);
    const { token, setToken, emptyToken } = useToken();
    const [login, setLogin] = useState(true);
    useEffect(() => {
        const timer = new SessionTimeout({
            token,
            emptyToken
        });

        return () => {
            timer.cleanUp();
        };
    }, [emptyToken, token]);

    if (!token) {
        return <LoginForm login={login} setLogin={setLogin} setToken={setToken} />
    }
    return (
        <Router>
            <Navigation open={open} setOpen={setOpen} token={token} emptyToken={emptyToken} ></Navigation>
            < Routes >
                <Route path="/register" element={<RegisterForm open={open}></RegisterForm>} />
                <Route path="/search" element={<SearchForm open={open}></SearchForm>} />
                <Route path="/attendance" element={<AttendanceForm open={open}></AttendanceForm>} />
                <Route path="/setting" element={<SettingForm open={open}></SettingForm>} />
                <Route path="/" element={<SearchForm open={open}></SearchForm>} />
            </Routes >
        </Router>

    );
}

export default App;
