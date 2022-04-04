import React, {useState} from 'react';
import clsx from 'clsx';

import {
    AppBar,
    Button,
    CssBaseline,
    Container,
    Drawer,
    Divider,
    Grid,
    IconButton,
    Link,
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Toolbar,
    Typography,
} from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Person from '@mui/icons-material/Person';
import { dashboardItems } from '../components/listItems';
import Copyright from "../components/Copyright";

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


//Creating fake data so the 
function createData(id, paperLink, uploader, date) {
    return { id, paperLink, uploader, date };
}

const rows = [
    createData(0, 'Published Paper1', 'User 1', '3/25/2022'),
    createData(1, 'Published Paper2', 'User 2', '3/26/2022'),
    createData(2, 'Published Paper3', 'User 3', '3/27/2022'),
];


const PublishView = () => {
  const [username, setUsername] = useState("Default Username");
    const classes = useStyles();
    const [open, setOpen] = useState(true);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

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
                        size="large">
                        <MenuIcon />
                    </IconButton>
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        Published Papers
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
                    <IconButton onClick={handleDrawerClose} size="large">
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                {dashboardItems}
            </Drawer>
            <main className={classes.content}>
                <div className={classes.appBarSpacer}>
                    <Container maxWidth="lg" className={classes.container}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={12} lg={12}>
                                <Button variant="contained" color="primary" href="/upload">
                                    UPLOAD
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Published Paper</TableCell>
                                            <TableCell>Paper Owner</TableCell>
                                            <TableCell>Most Recent Edit</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell>
                                                    <Link href="/1" underline="hover">
                                                        {row.paperLink}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    {row.uploader}
                                                </TableCell>
                                                <TableCell>
                                                    {row.date}
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
}

export default PublishView;
