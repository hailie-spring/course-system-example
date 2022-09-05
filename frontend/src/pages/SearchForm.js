import * as React from 'react';
import { memo, useState, useEffect, forwardRef, useCallback } from "react";
import { useTranslation } from 'react-i18next';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
import SelectWrapper from '../components/SelectWrapper';
import SearchInput from '../components/SearchInput';
import DateRange from '../components/DateRange';
import DataGridWrapper from '../components/DataGridWrapper';
import { getISOFormat, getSearchQuery } from '../lib/utils';
import { addDays } from 'date-fns';
import { OPEN_NAVIGATION_WIDTH } from '../config/config';
import { CLOSE_NAVIGATION_WIDTH } from '../config/config';

const SEARCH_URL = '/course/api/v1/search';
const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TransitionDown(props) {
    return <Slide {...props} direction="down" />;
}
function SearchForm(props) {
    const [openAlert, setOpenAlert] = useState(false);
    const [result, setResult] = useState('success');
    const [transition, setTransition] = useState(undefined);
    const [serviceType, setSericeType] = useState('registration');
    const [courseName, setCourseName] = useState('all');
    const [fieldName, setFieldName] = useState('contractNumber');
    const [fromDate, setFromDate] = useState(addDays(new Date(), -180));
    const [toDate, setToDate] = useState(new Date());
    const [fieldValue, setFieldValue] = useState('');
    const [rows, setRows] = useState([]);
    const { t } = useTranslation();
    const services = t('services');
    const courses = t('courses');
    const fieldDetails = t(`search.${serviceType}SearchFields`);
    const coursesDetails = courses['details'];
    coursesDetails.all = courses['all'];
    const errorMessage = t('search.error');

    const handleSubmit = useCallback(async () => {
        try {
            const params = {
                source: `${serviceType}-system`,
                courseName: courseName ? (courseName === 'all' ? undefined : courseName) : undefined,
                fieldName: fieldName ? fieldName : undefined,
                fieldValue: fieldValue ? fieldValue : undefined,
                startTime: getISOFormat(fromDate),
                endTime: getISOFormat(toDate)
            };
            const response = await getSearchQuery(SEARCH_URL, params);
            const data = response.data.data;
            data.map((item) => {
                if (serviceType === 'registration') {
                    item.id = item.contractNumber;
                } else {
                    item.id = item.docId;
                }
                return item;
            });
            setRows(data);
        } catch (error) {
            setOpenAlert(true);
            setTransition(() => TransitionDown);
            setResult('error');
        }
    }, [serviceType, courseName, fromDate, toDate, fieldName, fieldValue]);

    useEffect(() => {
        handleSubmit();
    }, [handleSubmit]);

    return (
        <div>
            <Box
                component="form" sx={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                    marginTop: '80px',
                    marginLeft: props.open ? `${OPEN_NAVIGATION_WIDTH}px` : `${CLOSE_NAVIGATION_WIDTH}px`
                }}
            >
                <SelectWrapper
                    prefix='search-form'
                    tag='service-type'
                    label={services['label']}
                    details={services['details']}
                    varType={serviceType}
                    setVarType={(event) => {
                        setSericeType(event.target.value);
                    }}
                ></SelectWrapper>
                <Box sx={{ mx: 1.5 }}> </Box>
                <SelectWrapper
                    prefix='search-form'
                    tag='course-name'
                    label={courses['label']}
                    details={coursesDetails}
                    varType={courseName}
                    setVarType={(event) => {
                        setCourseName(event.target.value);
                    }}
                ></SelectWrapper>
                <Box sx={{ mx: 1.5 }}> </Box>
                <DateRange
                    fromLabel={t('search.date.from')}
                    fromDate={fromDate}
                    setFromDate={setFromDate}
                    toLabel={t('search.date.to')}
                    toDate={toDate}
                    setToDate={setToDate}

                ></DateRange>
                <Box sx={{ mx: 1.5 }}> </Box>
                <SearchInput
                    prefix='search-form'
                    tag='field-name'
                    label={t('search.fieldLabel')}
                    details={fieldDetails}
                    varType={fieldName}
                    setVarType={(event) => {
                        setFieldName(event.target.value);
                    }}
                    fieldValue={fieldValue}
                    setFieldValue={setFieldValue}
                    handleSearch={handleSubmit}
                ></SearchInput>
                <Snackbar
                    anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
                    TransitionComponent={transition}
                    open={openAlert} autoHideDuration={2000} onClose={() => { setOpenAlert(false) }}>
                    <Alert onClose={() => { setOpenAlert(false) }} severity={result} sx={{ width: '100%' }}>
                        {result === 'error' ? errorMessage : null}
                    </Alert>
                </Snackbar>
            </Box>
            <DataGridWrapper headers={t(`search.${serviceType}Headers`)} rows={rows} open={props.open}></DataGridWrapper>
        </div>
    );

}

export default memo(SearchForm);