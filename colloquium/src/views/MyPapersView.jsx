import React from 'react';
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
    List, 
    ListItem,
    ListItemIcon,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Toolbar,
    Typography,
    Switch,
    FormControlLabel,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import People from '@material-ui/icons/People';

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
const createData = (id, paperLink, uploader, date, published) => {
    return { id, paperLink, uploader, date, published };
}
  
const rows = [
    createData(0, 'My Paper1', 'Me', '3/25/2022', true),
    createData(1, 'My Paper2', 'Me', '3/26/2022', false),
    createData(2, 'My Paper3', 'Me', '3/27/2022', true),
];

const MyPapersView = () => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    // const [publish, setPublished] = React.useState(false);
    const handlePublishedClick = (id, paperLink, uploader, date, published) => {
        rows[id] = createData(id, paperLink, uploader, date, published);
    }

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
                        <MenuIcon />
                    </IconButton>
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        My Papers
                    </Typography>
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
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <List component="paperViews">
                    <ListItem button>
                        <ListItemIcon onClick={handleDrawerOpen}>
                            <People />
                        </ListItemIcon>
                        <Link href="./published">
                            Published
                        </Link>
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon onClick={handleDrawerOpen}>
                            <People />
                        </ListItemIcon>
                        <Link href="./shared">
                            Shared With Me
                        </Link>
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon onClick={handleDrawerOpen}>
                            <People />
                        </ListItemIcon>
                        <Link href="./mypapers">
                            My Papers
                        </Link>
                    </ListItem>
                </List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.appBarSpacer}>
                    <Container maxWidth="lg" className={classes.container}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={12} lg={12}>
                                <Button variant="contained" color="primary" href="">
                                    UPLOAD
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <Table component="PublishedPapers">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>My Papers</TableCell>
                                            <TableCell>Paper Owner</TableCell>
                                            <TableCell>Most Recent Edit</TableCell>
                                            <TableCell>Publish</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell>
                                                    <Link href="/">
                                                        {row.paperLink}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    {row.uploader}
                                                </TableCell>
                                                <TableCell>
                                                    {row.date}
                                                </TableCell>
                                                <TableCell>
                                                        <FormControlLabel
                                                            control={
                                                            <Switch
                                                                checked={row.published}
                                                                onChange={handlePublishedClick(row.id, row.paperLink, row.uploader, row.date, row.published)}
                                                                color="primary"
                                                            />
                                                            }
                                                            label = {row.published ? "Published": "Unpublished"}
                                                        />
     
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Grid>
                        </Grid>
                    </Container>
                </div>   
            </main>
        </div>
    );
}

export default MyPapersView;
