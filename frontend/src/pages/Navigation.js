import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SearchIcon from '@mui/icons-material/Search';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { useTranslation } from 'react-i18next';
import { OPEN_NAVIGATION_WIDTH } from '../config/config';
import { CLOSE_NAVIGATION_WIDTH } from '../config/config';
import { Link as RouterLink } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import LoginAppBar from '../components/LoginAppBar';

const drawerWidth = OPEN_NAVIGATION_WIDTH;
const closeWidth = CLOSE_NAVIGATION_WIDTH;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: closeWidth,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);
const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

function ListItemLink(props) {
    const { icon, primary, to } = props;

    const renderLink = React.useMemo(
        () =>
            React.forwardRef(function Link(itemProps, ref) {
                return <RouterLink to={to} ref={ref} {...itemProps} role={undefined} />;
            }),
        [to],
    );

    return (
        <li>
            <ListItem button component={renderLink}>
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={primary} />
            </ListItem>
        </li>
    );
}

export default function Navigation(props) {
    const theme = useTheme();
    const { t } = useTranslation();

    const handleDrawerClose = () => {
        props.setOpen(false);
    };
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <LoginAppBar open={props.open} setOpen={props.setOpen} emptyToken={props.emptyToken}></LoginAppBar>
            <Drawer variant="permanent" open={props.open}>
                <DrawerHeader>
                    <Typography variant="h6" component="div" sx={{
                        justifyContent: 'center',
                    }}>
                        {t('navigation').label}
                    </Typography>
                    <IconButton onClick={handleDrawerClose} >
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    <ListItemLink to="/register" primary={(t('navigation').services)['register']} icon={<AppRegistrationIcon />} />
                    <ListItemLink to="/search" primary={(t('navigation').services)['search']} icon={<SearchIcon />} />
                    <ListItemLink to="/attendance" primary={(t('navigation').services)['attendance']} icon={<AssignmentIndIcon />} />
                </List>
            </Drawer>
        </Box>
    );

}
