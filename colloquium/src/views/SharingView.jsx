import React, {useState, useEffect} from "react";
import clsx from 'clsx';
import { DocumentItems } from '../components/listItems';
import makeStyles from '@mui/styles/makeStyles';

import {
    TextField,
    Button,
    Table,
    TableRow,
    TableBody,
    TableCell,
    TableHead,
    AppBar,
    CssBaseline,
    Container,
    Drawer,
    Divider,
    Grid,
    IconButton,
    Toolbar,
    Typography,
    Box

} from "@mui/material"

import {
  Menu,
  ChevronLeft,
  Person,
} from "@mui/icons-material"

import Copyright from "../components/Copyright";
import paperApi from "../api/paper";
import { useAuth } from "../useAuth";

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
    fixedHeight: {
      height: 240,
    },
  }));

const SharingView = ({match, history}) => {
    const classes = useStyles();
    const paperId = match.params.paperId;
    let versionId = match.params.versionId;
    const { user } = useAuth();

    // Drawer
    const [open, setOpen] = useState(true);

    // Who is being shared with
    const [rows, setRows] = useState([]);

    // Document Info
    const [username, setUsername] = useState("Default Username");
    const [documentTitle, setDocumentTitle] = useState("");

    // Side Bare Handling
    const handleDrawerOpen = () => {
      setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    useEffect(async() => {
      const doc = await paperApi.getMetaDataById(paperId);
      // Getting Document Title
      setDocumentTitle(doc.title);

      // Get Shared People
      console.log("[ShareList] mount");
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
                    Share {documentTitle} With:
                </Typography>
                <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<Person />}
                    href="/userprofile"
                >
                    {user.firstName}
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
                            <TextField fullWidth label='Please Enter User to Share With'></TextField>
                            <Button variant="contained" color="primary" href={"/" + paperId + "/" + versionId + "/share"}>
                                Share With
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Shared With</TableCell>
                                        <TableCell>Remove Share?</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell>
                                                {row.shareName}
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="contained" color="secondary" href="">Remove?</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
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
};


export default SharingView;

