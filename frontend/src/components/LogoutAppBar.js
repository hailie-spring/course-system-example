import * as React from 'react';
import { memo } from "react";
import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

function LoginForm(props) {
    const { t } = useTranslation();
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{
                        flexGrow: 1,
                        fontFamily: 'monospace',
                        fontWeight: 500
                    }}>
                        {t('title')}
                    </Typography>
                    <Stack direction="row" spacing={5} >
                        <Button color="inherit" variant="outlined" startIcon={<AppRegistrationIcon />} onClick={() => {
                            props.setLogin(false)
                        }}>
                            {t('sign.up')}
                        </Button>
                        <Button color="inherit" variant="outlined" endIcon={<LoginIcon />} onClick={() => {
                            props.setLogin(true)
                        }}>
                            {t('sign.in')}
                        </Button>
                    </Stack>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default memo(LoginForm);