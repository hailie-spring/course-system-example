import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { Link as RouterLink } from "react-router-dom";
import ContractDialog from './ContractDialog';
import { OPEN_NAVIGATION_WIDTH } from '../config/config';
import { CLOSE_NAVIGATION_WIDTH } from '../config/config';

function DataGridWrapper(props) {
    const { headers, rows } = props;
    headers.map((header) => {
        if (header.field === 'signIn') {
            header.renderCell = (params) => {
                return (<RouterLink to='/attendance'
                    state={params.row}> <AssignmentIndIcon ></AssignmentIndIcon> </RouterLink>)
            }

        } else if (header.field === 'moreDetail') {
            header.renderCell = (params) => {
                return (<ContractDialog state={params.row}></ContractDialog>);
            }
        }
        return header;

    });
    return (
        <Box sx={{
            height: 800,
            width: '100%',
            mt: 5,
            ml: props.open ? `${OPEN_NAVIGATION_WIDTH}px` : `${CLOSE_NAVIGATION_WIDTH}px`
        }}>
            <DataGrid
                rows={rows}
                columns={headers}
                pageSize={rows.length}
                rowsPerPageOptions={[rows.length]}
            />
        </Box>
    );
}

export default React.memo(DataGridWrapper);