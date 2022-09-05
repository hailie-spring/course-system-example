import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from 'react-i18next';
import { memo, useState, forwardRef } from "react";
import Stack from '@mui/material/Stack';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import ClearIcon from '@mui/icons-material/Clear';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import { postFormValues, getDateFormat } from '../lib/utils';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import { OPEN_NAVIGATION_WIDTH } from '../config/config';
import { CLOSE_NAVIGATION_WIDTH } from '../config/config';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TransitionDown(props) {
    return <Slide {...props} direction="down" />;
}

function RegisterForm(props) {
    const [birthdate, setBirthdate] = useState(new Date());
    const [openAlert, setOpenAlert] = useState(false);
    const [result, setResult] = useState('success');
    const [transition, setTransition] = useState(undefined);
    const { t } = useTranslation();
    const cancel = t('submit.cancel');
    const submit = t('submit.submit');
    const coursesDetails = t('courses.details');
    const registrationDetails = t('submit.registration');
    const successMessage = t('submit.success');
    const errorMessage = t('submit.error');
    const prefix = 'register-form';

    function initFormValues() {
        const initialFormValues = {
        };
        for (const key of Object.keys(registrationDetails)) {
            initialFormValues[key] = '';
        }
        initialFormValues['birthdate'] = getDateFormat(birthdate);
        return initialFormValues;
    }
    const [formValues, setFormValues] = useState(initFormValues());
    const handleChange = (event) => {
        setFormValues({
            ...formValues,
            [event.target.name]: event.target.value
        });
    };

    const handleClear = () => {
        setFormValues(initFormValues());
    }
    const handleDateChange = (value) => {
        setBirthdate(value);
        handleChange({
            target: {
                name: 'birthdate',
                value
            }
        })
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await postFormValues('/course/api/v1/registration', formValues);
            setFormValues(initFormValues());
            setResult('success');
        } catch (error) {
            setResult('error');
        }
        setTransition(() => TransitionDown);
        setOpenAlert(true);
    }

    const textFields = Object.keys(registrationDetails).map((key) => {
        if (key === 'courseName') {
            return (
                <div key={`${prefix}-${key}-div`}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id={`${prefix}-${key}-label`}>{registrationDetails[key]}</InputLabel>
                        <Select
                            labelId={`${prefix}-${key}-label`}
                            id={`${prefix}-${key}`}
                            name={key}
                            value={formValues[key]}
                            label={registrationDetails[key]}
                            onChange={handleChange}
                        >
                            {Object.keys(coursesDetails).map((option) => (
                                <MenuItem key={option} value={option}>
                                    {coursesDetails[option]}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            );
        } else if (key === 'birthdate') {
            return (
                <div key={`${prefix}-${key}-div`}>
                    <FormControl fullWidth margin="normal">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DesktopDatePicker
                                key={`${prefix}-${key}`}
                                label={registrationDetails[key]}
                                inputFormat="yyyy-MM-dd"
                                value={birthdate}
                                onChange={handleDateChange}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </FormControl>
                </div>
            );
        }
        else {
            let required = true;
            if (key === 'contractNumber') {
                required = false;
            }
            return (
                <div key={`${prefix}-${key}-div`}>
                    <TextField
                        required={required}
                        id={`${prefix}-${key}`}
                        key={`${prefix}-${key}`}
                        label={registrationDetails[key]}
                        margin="normal"
                        fullWidth
                        name={key}
                        value={formValues[key]}
                        onChange={handleChange}
                    />
                </div>
            );

        }
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
            <Stack direction="row" spacing={21} marginTop='2em'>
                <Button variant="outlined" startIcon={<ClearIcon />} onClick={handleClear}>
                    {cancel}
                </Button>
                <Button variant="outlined" endIcon={<SendIcon />} onClick={handleSubmit}>
                    {submit}
                </Button>
            </Stack>
            <Snackbar
                anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
                TransitionComponent={transition}
                open={openAlert} autoHideDuration={2000} onClose={() => { setOpenAlert(false) }}>
                <Alert onClose={() => { setOpenAlert(false) }} severity={result} sx={{ width: '100%' }}>
                    {result === 'success' ? successMessage : errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default memo(RegisterForm);