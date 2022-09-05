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
import { postFormValues, getDateFormat, getTimeFormat } from '../lib/utils';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useLocation, useNavigate  } from 'react-router-dom';
import { OPEN_NAVIGATION_WIDTH } from '../config/config';
import { CLOSE_NAVIGATION_WIDTH } from '../config/config';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TransitionDown(props) {
    return <Slide {...props} direction="down" />;
}

function AttendanceForm(props) {
    const [schoolDate, setSchoolDate] = useState(new Date());
    const [startSchoolTime, setStartSchoolTime] = useState(new Date());
    const [endSchoolTime, setEndSchoolTime] = useState(new Date());
    const [openAlert, setOpenAlert] = useState(false);
    const [result, setResult] = useState('success');
    const [transition, setTransition] = useState(undefined);
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const cancel = t('submit.cancel');
    const submit = t('submit.submit');
    const coursesDetails = t('courses.details');
    const attendanceDetails = t('submit.attendance');
    const successMessage = t('submit.success');
    const errorMessage = t('submit.error');
    const prefix = 'attendance-form';
    function initFormValues() {
        const initialFormValues = {
        };
        for (const key of Object.keys(attendanceDetails)) {
            if (location.state && location.state[key]) {
                initialFormValues[key] = location.state[key];
            } else {
                initialFormValues[key] = '';
            }
        }
        initialFormValues['schoolDate'] = getDateFormat(schoolDate);
        initialFormValues['startSchoolTime'] = getTimeFormat(startSchoolTime);
        initialFormValues['endSchoolTime'] = getTimeFormat(endSchoolTime);
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

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await postFormValues('/course/api/v1/attendance', formValues);
            setFormValues(initFormValues());
            // setResult('success');
            navigate('/search');
        } catch (error) {
            setResult('error');
            setTransition(() => TransitionDown);
            setOpenAlert(true);
        }
       
    }

    const textFields = Object.keys(attendanceDetails).map((key) => {
        if (key === 'courseName') {
            if (location.state && location.state.courseName) {
                return (
                    <div key={`${prefix}-${key}-div`}>
                        <TextField
                            id={`${prefix}-${key}`}
                            key={`${prefix}-${key}`}
                            label={attendanceDetails[key]}
                            margin="normal"
                            fullWidth
                            name={key}
                            value={location.state.courseName}
                            disabled
                        />
                    </div>
                );
            }
            return (
                <div key={`${prefix}-${key}-div`}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id={`${prefix}-${key}-label`}>{attendanceDetails[key]}</InputLabel>
                        <Select
                            labelId={`${prefix}-${key}-label`}
                            id={`${prefix}-${key}`}
                            name={key}
                            value={formValues[key]}
                            label={attendanceDetails[key]}
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
        } else if (key === 'schoolDate') {
            return (
                <div key={`${prefix}-${key}-div`}>
                    <FormControl fullWidth margin="normal">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DesktopDatePicker
                                key={`${prefix}-${key}`}
                                label={attendanceDetails[key]}
                                inputFormat="yyyy-MM-dd"
                                value={schoolDate}
                                onChange={(value) => {
                                    setSchoolDate(value);
                                    handleChange({
                                        target: {
                                            name: 'schoolDate',
                                            value: getDateFormat(value)
                                        }
                                    });
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </FormControl>
                </div>
            );
        } else if (key === 'startSchoolTime') {
            return (
                <div key={`${prefix}-${key}-div`}>
                    <FormControl fullWidth margin="normal">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <TimePicker
                                label={attendanceDetails[key]}
                                value={startSchoolTime}
                                ampm={false}
                                onChange={(newValue) => {
                                    setStartSchoolTime(newValue);
                                    handleChange({
                                        target: {
                                            name: 'startSchoolTime',
                                            value: getTimeFormat(newValue)
                                        }
                                    });
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </FormControl>

                </div>
            );
        } else if (key === 'endSchoolTime') {
            return (
                <div key={`${prefix}-${key}-div`}>
                    <FormControl fullWidth margin="normal">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <TimePicker
                                label={attendanceDetails[key]}
                                value={endSchoolTime}
                                ampm={false}
                                onChange={(newValue) => {
                                    setEndSchoolTime(newValue);
                                    handleChange({
                                        target: {
                                            name: 'endSchoolTime',
                                            value: getTimeFormat(newValue)
                                        }
                                    });
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </FormControl>

                </div>
            );
        } else {
            let disabled = false;
            let value = formValues[key];
            let multiline = false;
            if (key === 'evaluation') {
                multiline = true;
            }
            if (location.state && location.state[key]) {
                disabled = true;
                value = location.state[key];
            }
            return (
                <div key={`${prefix}-${key}-div`}>
                    <TextField
                        required={true}
                        id={`${prefix}-${key}`}
                        key={`${prefix}-${key}`}
                        label={attendanceDetails[key]}
                        margin="normal"
                        fullWidth
                        name={key}
                        value={value}
                        multiline={multiline}
                        rows={4}
                        disabled={disabled}
                        onChange={disabled ? null : handleChange}
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

export default memo(AttendanceForm);