import React from "react";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PersonIcon from '@material-ui/icons/Person';
import CommentList from "../components/CommentList";
import GoogleViewer from "../components/docs";
import { mainListItems } from './listItems';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit">
            Colloquium
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
        </Typography>
    );
};

const DocumentView = () => {
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
          paddingTop: theme.spacing(4),
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

    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const [docuemntTitle, setDocumentTitle] = React.useState("Document Title");
    const [username, setUsername] = React.useState("Default Username");

    const [comments, setComments] = React.useState([]);
    const [isFetching, setFetching] = React.useState(false);
    const [version, setVersion] = React.useState("");

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    const docs = [
        { uri: require("../TestingData/test.pdf") }
    ];

    const handleChange = (event) => {
      setVersion(event.target.value);
  };

     
    // Adds comment to specific paperId/pageId
    // const addComment = (paperId, pageId, commentId) => {}

    // // Adds reply to a previous parent comment
    // const addReplyComment = (paperId, pageId, parentCommentId, commentId) => {}

    // // Page to reupload document for the next version
    // const reupload = (paperId, versionId) => {}

    // // Adding or Deleting people allowed to view paper
    // const handleShare = (paperId) => {}

    // // Update version number and "clear" comments / reviews
    // const handleVersion = (paperId) => {}

    // // Views: Review, Documents, Comments, or Document and Comments
    // const handleViewChange = (paperId) => {}

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
                        {docuemntTitle}
                    </Typography>
                    <Button
                        variant="link"
                        color="inherit"
                        startIcon={<PersonIcon />}
                        href="/"
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
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <List>{mainListItems}</List>
                <Select
                    labelId="Version Select Label"
                    id="Version Select"
                    label="Version"
                    value={version}
                    onChange={handleChange}
                >
                    <MenuItem value={1}>Version 1</MenuItem>
                    <MenuItem value={2}>Version 2</MenuItem>
                    <MenuItem value={3}>Version 3</MenuItem>
                </Select>

            </Drawer>
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={5}>
                        {/* Document */}
                        <Grid item xs={8}>
                            {/* <DocViewer pluginRenderers={DocViewerRenderers} documents={docs} /> */}
                            <GoogleViewer source={"https://s2.q4cdn.com/498544986/files/doc_downloads/test.pdf"} />
                        </Grid>
                        {/* Comments */}
                        <Grid item xs={4}>
                            <CommentList />
                            <Button
                                color="primary"
                                variant="contained"
                                fullWidth="true"
                            >
                                Add Comment
                            </Button>
                        </Grid>
                    </Grid>
                    <Box pt={4}>
                        <Copyright />
                    </Box>
                </Container>
            </main>
        </div>
    );
}

export default DocumentView;

