import * as React from 'react';
import SelectWrapper from './SelectWrapper';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

function SearchInput(props) {
    const { prefix, tag, label, varType, setVarType, details } = props;

    return (
        <Paper
            sx={{ mt: 1, display: 'flex', alignItems: 'center', width: 500 }}
        >
            <SelectWrapper
                prefix={prefix}
                tag={tag}
                label={label}
                details={details}
                varType={varType}
                setVarType={setVarType}
                variant='standard'
            ></SelectWrapper>
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <InputBase
                placeholder={details[varType]}
                value={props.fieldValue}
                onChange={(event) => {
                    props.setFieldValue(event.target.value)
                }}
            />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton aria-label="search" onClick={() => { props.handleSearch() }}>
                <SearchIcon />
            </IconButton>
        </Paper>
    );
}

export default React.memo(SearchInput);