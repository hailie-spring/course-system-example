import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Stack from '@mui/material/Stack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function DateRange(props) {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={2}
                direction='row'
                mt={1}
                divider={<ArrowForwardIcon></ArrowForwardIcon>}
                justifyContent="center"
                alignItems="center">
                <DateTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    label={props.fromLabel}
                    inputFormat="yyyy-MM-dd HH:mm:ss"
                    ampm={false}
                    ampmInClock={false}
                    value={props.fromDate}
                    onChange={(newValue) => {
                        props.setFromDate(newValue);
                    }}
                />
                <DateTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    label={props.toLabel}
                    inputFormat="yyyy-MM-dd HH:mm:ss"
                    ampm={false}
                    ampmInClock={false}
                    value={props.toDate}
                    onChange={(newValue) => {
                        props.setToValue(newValue);
                    }}
                />
            </Stack>
        </LocalizationProvider>

    );
}

export default React.memo(DateRange);