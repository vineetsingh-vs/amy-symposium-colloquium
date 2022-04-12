import React, {useEffect} from "react";
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import {
  Button,
  CssBaseline,
  Drawer,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  IconButton,
  Container,
  Grid,
  Input
} from "@mui/material"

import {
  Menu,
  ChevronLeft,
  Person
} from "@mui/icons-material"

import { DocumentItems } from '../components/listItems';
import Copyright from "../components/Copyright";
import paperApi from "../api/paper";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

const ReuploadView = ({match, history}) => {

    const classes = useStyles();
    const paperId = match.params.paperId;
    let versionId = match.params.versionId;

    // Drawer
    const [open, setOpen] = React.useState(false);

    // Document Information
    const [documentTitle, setDocumentTitle] = React.useState("");
    const [username, setUsername] = React.useState("Default Username");

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const [upload, setUpload] = React.useState(true);
    const handleUpload = () => {
        setUpload(false);
    };

    useEffect(() => {
      async function fetchData() {
        return await paperApi.getMetaDataById(paperId);
      }
      // Getting Document Title
      setDocumentTitle(fetchData().title);
    }, []);

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                    >
                        <Menu />
                    </IconButton>
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        Reupload Document
                    </Typography>
                    <Button
                        variant="link"
                        color="inherit"
                        startIcon={<Person />}
                        href="/userprofile"
                    >
                        {username}
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                classes={{
                    paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                }}
                open={open}
            >
                <div className={classes.toolbarIcon}>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeft />
                    </IconButton>
                </div>
                <Divider />
                <DocumentItems versionId={versionId}/>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.appBarSpacer}>
                    <Container maxWidth="lg" className={classes.container}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={12} lg={12}>
                            <label htmlFor="contained-button-file">  
                                <Input accept="*" id="contained-button-file" multiple type="file" onChange={handleUpload}/>                                   
                            </label>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <Button variant="contained" color="primary" disabled={upload} href="/1">
                                    CONFIRM REUPLOAD
                                </Button>  
                            </Grid>
                        </Grid>
                        <Box pt={4}>
                            <Copyright />
                        </Box>
                    </Container>
                </div>   
            </main>
        </div>
    );
}

export default ReuploadView;