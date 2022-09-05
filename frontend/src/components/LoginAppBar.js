import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useTranslation } from 'react-i18next';
import { OPEN_NAVIGATION_WIDTH } from '../config/config';
import { Link as RouterLink } from "react-router-dom";
import { TOKEN_NAME } from '../config/config';
// import AppBar from '@mui/material/AppBar';
const drawerWidth = OPEN_NAVIGATION_WIDTH;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));



function LoginAppBar(props) {
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleDrawerOpen = () => {
        props.setOpen(true);
    };
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    function handleLogout() {
        localStorage.removeItem(TOKEN_NAME);
        props.emptyToken();
    }

    // function handleChangePassword(){
    //     return (<RouterLink to='/setting'
    //     state={params.row}> <AssignmentIndIcon ></AssignmentIndIcon> </RouterLink>)
    // }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar open={props.open} position="fixed">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(props.open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h5" noWrap component="div" sx={{
                        flexGrow: 1,
                        fontFamily: 'monospace',
                        fontWeight: 500
                    }}>
                        {t('title')}
                    </Typography>
                    <div>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircleIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem><RouterLink to='/setting'
                                state={{ type: 'changePassword' }}> {t('sign.setting.changePassword')} </RouterLink></MenuItem>
                            <MenuItem onClick={handleLogout}>{t('sign.setting.signout')}</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
        </Box >
    );
}

export default React.memo(LoginAppBar);

