import * as React from 'react';
import { memo, useState, forwardRef } from "react";
import { useTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import { postFormValues } from '../lib/utils';
import LogoutAppBar from '../components/LogoutAppBar';
import { USERNAME_STORE } from '../config/config';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TransitionDown(props) {
    return <Slide {...props} direction="down" />;
}

function LoginForm(props) {
    const { t } = useTranslation();
    const fieldDetails = props.login ? t(`sign.inField`) : t(`sign.upField`);
    const prefix = 'sign-form';
    const [values, setValues] = React.useState({
        email: '',
        password: '',
        telephoneNumber: '',
        showPassword: false,
    });
    const [result, setResult] = useState('success');
    const [openAlert, setOpenAlert] = useState(false);
    const [transition, setTransition] = useState(undefined);
    const [errorMessage, setErrorMessage] = useState();
    function setUsername(username) {
        localStorage.setItem(USERNAME_STORE, username);
    }
    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const url = props.login ? '/course/api/v1/signin' : '/course/api/v1/signup'
        try {
            const response = await postFormValues(url, values);
            props.setToken(response.data.token);
            setUsername(values.telephoneNumber);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage(t('sign.up400Error'));
            } else if (error.response && error.response.status === 401) {
                setErrorMessage(t('sign.in401Error'));
            } else {
                setErrorMessage(t('sign.common500Error'));
            }
            setResult('error');
            setTransition(() => TransitionDown);
            setOpenAlert(true);
        }

    }

    const textFields = Object.keys(fieldDetails).map((key) => {
        let type = 'text';
        if (key === 'email') {
            type = 'email';
        } else if (key === 'password') {
            return (
                <TextField
                    id={`${prefix}-${key}`}
                    key={`${prefix}-${key}`}
                    label={fieldDetails[key]}
                    variant="outlined"
                    margin="normal"
                    type={values.showPassword ? "text" : "password"}
                    onChange={handleChange('password')}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
            );
        }
        return (
            <TextField
                id={`${prefix}-${key}`}
                key={`${prefix}-${key}`}
                label={fieldDetails[key]}
                variant="outlined"
                margin="normal"
                fullWidth
                name={key}
                type={type}
                onChange={handleChange(key)}
            />
        );
    });
    return (
        <div>
            <LogoutAppBar setLogin={props.setLogin}></LogoutAppBar>
            <Box
                component="form" sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexWrap: 'nowrap',
                    marginTop: '80px',
                    marginLeft: `calc(50%  - 200px)`,
                    width: '400px'
                }}
            >
                {textFields}
                {props.login ?
                    (<Button sx={{ mt: '2em' }} variant="outlined" endIcon={<LoginIcon />} onClick={handleSubmit}>
                        {t('sign.in')}
                    </Button>) :
                    (<Button sx={{ mt: '2em' }} variant="outlined" startIcon={<AppRegistrationIcon />} onClick={handleSubmit}>
                        {t('sign.up')}
                    </Button>)
                }
                <Snackbar
                    anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
                    TransitionComponent={transition}
                    open={openAlert} autoHideDuration={5000} onClose={() => { setOpenAlert(false) }}>
                    <Alert onClose={() => { setOpenAlert(false) }} severity={result} sx={{ width: '100%' }}>
                        {result === 'success' ? null : errorMessage}
                    </Alert>
                </Snackbar>
            </Box>

        </div>
    );

}

export default memo(LoginForm);