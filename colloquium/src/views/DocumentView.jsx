import React, { useEffect, useState } from "react";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import CustomPDFRenderer from "../renderers/CustomPDFRenderer";
import clsx from "clsx";
import makeStyles from '@mui/styles/makeStyles';
import {
    Button,
    CssBaseline,
    Drawer,
    Box,
    AppBar,
    Toolbar,
    List,
    Typography,
    Select,
    MenuItem,
    Divider,
    IconButton,
    Container,
    Grid,
} from "@mui/material"
import Menu from "@mui/icons-material/Menu";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import Person from "@mui/icons-material/Person";
import CommentList from "../components/CommentList";
import { documentItems } from "../components/listItems";
import Copyright from '../components/Copyright'
import { PDFContext } from "react-doc-viewer/build/plugins/pdf/state/index"

const drawerWidth = 240;
const currentDocumentPage = 1;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 8px",
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: "none",
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: "relative",
        whiteSpace: "nowrap",
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up("sm")]: {
            width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: "flex",
        overflow: "auto",
        flexDirection: "column",
    },
    fixedHeight: {
        height: 240,
    },
}));

const ChangeCurrentPage = (page) => {
    currentDocumentPage = page
}

const DocumentView = () => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [docuemntTitle, setDocumentTitle] = useState("Document Title");
    const [username, setUsername] = useState("Default Username");
    const [comments, setComments] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [version, setVersion] = useState("");

    const listComments = () => {
        const url = "https://jsonplaceholder.typicode.com/posts/1/comments";
        fetch(url)
            .then((response) => response.json())
            .then((comments) => {
                let commentList = comments.slice(0, 10);
                setComments(commentList);
                console.log("[CommentList] got comments");
            });
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleChange = (event) => {
        setVersion(event.target.value);
    };


    const docs = [{ uri: "https://api.printnode.com/static/test/pdf/multipage.pdf" }];

    useEffect(() => {
        console.log("[CommentList] mount");
        setIsFetching(true);
        listComments();
        setIsFetching(false);
    }, []);

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

    if (isFetching) {
        return "Loading...";
    } else {
        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar
                    position="absolute"
                    className={clsx(classes.appBar, open && classes.appBarShift)}
                >
                    <Toolbar className={classes.toolbar}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            className={clsx(
                                classes.menuButton,
                                open && classes.menuButtonHidden
                            )}
                            size="large">
                            <Menu />
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            className={classes.title}
                        >
                            {docuemntTitle}
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
                            <ChevronLeft />
                        </IconButton>
                    </div>
                    <Divider />
                    {documentItems}
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
                                <DocViewer 
                                    pluginRenderers={[CustomPDFRenderer]}
                                    documents={docs} 
                                    config={{
                                        header: {
                                            disableFileName: true,
                                            disableHeader: true,
                                            retainURLParams: false
                                        }
                                    }}
                                />
                            </Grid>
                            {/* Comments */}
                            <Grid item xs={4}>
                                <CommentList comments={comments}/>
                                <Button color="primary" variant="contained" fullWidth={true}>
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
};

export{
    DocumentView,
    ChangeCurrentPage
};
