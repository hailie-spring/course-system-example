import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';
import { memo, useState, forwardRef } from "react";
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { postFormValues } from '../lib/utils';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import { OPEN_NAVIGATION_WIDTH, USERNAME_STORE } from '../config/config';
import { CLOSE_NAVIGATION_WIDTH } from '../config/config';


const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TransitionDown(props) {
    return <Slide {...props} direction="down" />;
}

function ChangePasswordForm(props) {
    const [openAlert, setOpenAlert] = useState(false);
    const [result, setResult] = useState('success');
    const [transition, setTransition] = useState(undefined);
    const { t } = useTranslation();
    const details = t('sign.changePasswordField');
    const initialValues = {
        old: '',
        new: '',
        confirm: '',
        showold: false,
        shownew: false,
        showconfirm: false
    };
    const [values, setValues] = useState(initialValues);
    const [errorMessage, setErrorMessage] = useState(t('sign.common500Error'));
    const successMessage = t('sign.changePasswordSuccess');
    const prefix = 'change-password-form';

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setResult('error');
        try {
            if (values.new !== values.confirm) {
                setErrorMessage(t('sign.diffError'));
            } else if (values.confirm === values.old) {
                setErrorMessage(t('sign.sameError'));
            } else {
                const params = {
                    telephoneNumber: localStorage.getItem(USERNAME_STORE),
                    password: values.old,
                    newPassword: values.confirm
                }
                await postFormValues('/course/api/v1/signup', params, 'patch');
                setValues(initialValues);
                setResult('success');
            }
        } catch (error) {
            setResult('error');
            if (error.response && error.response.status === 401) {
                setErrorMessage(t('sign.invalidError'));
            } else {
                setErrorMessage(t('sign.common500Error'));
            }
        }
        setTransition(() => TransitionDown);
        setOpenAlert(true);
    }

    const handleClickShowPassword = (key) => {
        const newKey = `show${key}`
        setValues({
            ...values,
            [newKey]: !values[newKey],
        });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    }


    const textFields = Object.keys(details).map((key) => {
        return (
            <TextField
                id={`${prefix}-${key}`}
                key={`${prefix}-${key}`}
                label={details[key]}
                variant="outlined"
                margin="normal"
                type={values[`show${key}`] ? "text" : "password"}
                value={values[key]}
                onChange={handleChange(key)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => handleClickShowPassword(key)}
                                onMouseDown={handleMouseDownPassword}
                            >
                                {values[`show${key}`] ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />
        );
    });

    return (
        <Box
            component="form" sx={{
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'wrap',
                marginTop: '5em',
                marginLeft: props.open ? `calc(50% + ${OPEN_NAVIGATION_WIDTH / 2}px - 200px)` : `calc(50% + ${CLOSE_NAVIGATION_WIDTH / 2}px - 200px)`,
                width: '400px'

            }}
        >

            {textFields}
            <Button sx={{ mt: '2em' }} variant="outlined" onClick={handleSubmit}>
                {t('sign.updatePassword')}
            </Button>
            <Snackbar
                anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
                TransitionComponent={transition}
                open={openAlert} autoHideDuration={4000} onClose={() => { setOpenAlert(false) }}>
                <Alert onClose={() => { setOpenAlert(false) }} severity={result} sx={{ width: '100%' }}>
                    {result === 'success' ? successMessage : errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default memo(ChangePasswordForm);