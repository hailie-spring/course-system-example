import * as React from 'react';
import { useTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import DetailsIcon from '@mui/icons-material/Details';
import CloseIcon from '@mui/icons-material/Close';

function ContractDialog(props) {
    const { t } = useTranslation();
    const details = t('search.registrationDetails');
    const [open, setOpen] = React.useState(false);
    const prefix = 'contract-dialog';
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    props.state['leftQuantity'] = props.state['totalQuantity'] - props.state['consumedQuantity'];
    const texts = details.map((item) => {
        return (
            <TextField
                key={`${prefix}-${item.key}`}
                id={`${prefix}-${item.key}`}
                disabled={true}
                autoFocus
                margin="normal"
                label={item.label}
                type="text"
                fullWidth
                variant="standard"
                value={props.state[item.key] ? props.state[item.key]: ' '}
            />
        );
    });

    return (
        <div>
            <Button variant="text" onClick={handleClickOpen}>
                <DetailsIcon></DetailsIcon>
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{t('search.contractDetail')}</DialogTitle>
                <DialogContent>
                    {texts}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}><CloseIcon></CloseIcon></Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default React.memo(ContractDialog);