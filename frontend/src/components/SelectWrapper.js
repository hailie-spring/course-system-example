import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

function SelectWrapper(props) {
    const { prefix, tag, label, varType, setVarType, details, variant } = props;
    return (
        <div key={`${prefix}-${tag}-div`} width='100px' >
            <FormControl sx={{ width: 200, mt: 1 }} variant={variant ? variant : 'outlined'}>
                <InputLabel id={`${prefix}-${tag}-label`}>{label}</InputLabel>
                <Select
                    labelId={`${prefix}-${tag}-label`}
                    id={`${prefix}-${tag}`}
                    name={tag}
                    value={varType}
                    label={label}
                    onChange={setVarType}
                >
                    {Object.keys(details).map((option) => (
                        <MenuItem key={option} value={option}>
                            {details[option]}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

export default React.memo(SelectWrapper);