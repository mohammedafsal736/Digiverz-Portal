import React, { useEffect,useState }  from "react";
import { Outlet, useNavigate } from 'react-router-dom';
import Navigation from "./Navigation";
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import DatasetIcon from '@mui/icons-material/Dataset';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import TimelineIcon from '@mui/icons-material/Timeline';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';

import DQhome from "./DataQuality/DQhome";
import DataInput from "./ModelBuilder/DataInput";
import MBHome from "./ModelBuilder/MBHome";
import AlHome from "./AlgorithmAnalyzer/AlHome";
import SalesHome from "./SalesForecasting/SalesHome";

const drawerWidth = 240;

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
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });
  
  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));
  
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
  

const Home = () => {

    const [variable,setVariable]=useState(0);

    let navigate= useNavigate();

    useEffect(() =>{
        if(!localStorage.getItem('token')){
            navigate('/signin');
        }
    })
    let signin=true;

    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleChange = (event) => {
        setAuth(event.target.checked);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () =>{
        navigate('/signin');
        localStorage.removeItem('token');
        localStorage.removeItem('name');
    }

    const dataqualityhandle = () =>{
        console.log("dataquality clicked")
        setVariable(0);
    }

    const modelbuilderhandle =()=> {
        console.log("modelbuilderhandle");
        setVariable(1);
    }

    const salesforecastinghandle = () => {
        console.log("salesforecastinghandle");
        setVariable(2);
    }

    const algorithmanalyzerhandle = () => {
        console.log("algorithmanalyzerhandle");
        setVariable(3);
    }

    return(
        <div> 
            <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ bgcolor: "black" }} open={open}>
                <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={{ mr: 2, ...(open && { display: 'none' }) }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    DigiverZ Portal
                </Typography>
                {auth && (
                    <div>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleLogout}>Log Out</MenuItem>
                    </Menu>
                    </div>
                )}
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" PaperProps={{
                    sx: {
                    backgroundColor: "gray",
                    color: "black",
                    }
                }} open={open}>
            <DrawerHeader>
            <Typography>Various Types of Portal</Typography>
            <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
            <ListItem disablePadding>
                <ListItemButton>
                <ListItemIcon>
                    <DatasetIcon />
                </ListItemIcon>
                <ListItemText primary="Data Quality" onClick={dataqualityhandle} />
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton>
                <ListItemIcon>
                    <ModelTrainingIcon />
                </ListItemIcon>
                <ListItemText primary="Model Builder" onClick={modelbuilderhandle} />
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton>
                <ListItemIcon>
                    <TimelineIcon />
                </ListItemIcon>
                <ListItemText primary="Sales Forecasting" onClick={salesforecastinghandle} />
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton>
                <ListItemIcon>
                    <TroubleshootIcon/>
                </ListItemIcon>
                <ListItemText primary="Algorithm Analyzer" onClick={algorithmanalyzerhandle} />
                </ListItemButton>
            </ListItem>
            </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                {variable ===0 ?<DQhome /> : variable ===1 ? <MBHome/> : variable===2 ? <SalesHome /> : <AlHome />}
            </Box>
            </Box>

            {/* <Navigation isSignedIn={signin}></Navigation>
            <Outlet/>     */}
        </div>
    )
} 

export default Home;