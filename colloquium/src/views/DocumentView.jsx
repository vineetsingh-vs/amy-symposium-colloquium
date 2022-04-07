import React, { useEffect, useState } from "react";
import DocViewer, 
{ 
    BMPRenderer,
    HTMLRenderer,
    JPGRenderer,
    MSGRenderer,
    PNGRenderer,
    TIFFRenderer,
    TXTRenderer,
    MSDocRenderer
} from "react-doc-viewer";
import CustomXLSXRenderer from "../renderers/CustomXLSXRenderer";
import CustomPDFRenderer from "../renderers/CustomPDFRenderer";
import CustomMSDocRenderer from "../renderers/CustomMSDocRenderer";
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
    TextField,
    Input
} from "@mui/material"
import Menu from "@mui/icons-material/Menu";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import Person from "@mui/icons-material/Person";
import CommentList from "../components/CommentList";
import { DocumentItems } from "../components/listItems";
import Copyright from '../components/Copyright'
import paperApi from "../api/paper";

const drawerWidth = 240;
const pageContext = {
    currentPage: 1,
};

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
    pageContext.currentPage = page
}

const DocumentView = ({match, history}) => {
    const classes = useStyles();
    const paperId = match.params.paperId;
    let versionId = match.params.versionId;

    // Drawer
    const [open, setOpen] = useState(false);

    // Displaying Document
    const [username, setUsername] = useState("Default Username");
    const [comments, setComments] = useState([]);
    const [docs, setDocs] = useState([{ uri: paperApi.getDocumentURI(paperId, versionId)}])
    const [documentTitle, setDocumentTitle] = useState("");

    const [isFetching, setIsFetching] = useState(false);

    // Comment Handling
    const [currentComment, setCurrentComment] = useState("");
    const handleType = (text) => {
        setCurrentComment(text.target.value);
    }

    const handleClick = () => {
        comments.push(createComment(comments.length, username, currentComment, []));
        listComments();
        console.log(comments);
        setCurrentComment("");
    }
    
    const createComment = (id, name, body, replies) => {
        // Push a comment thing here to backend
        return { id, name,  body, replies};
    }

    const listComments = () => {
        let commentList = comments.slice();
        setComments(commentList);
        console.log("[CommentList] got comments");
    };

    // Side Bar Handling
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    // Version Control
    const ChangeCurrentVersion = (event) => {
        versionId = event.target.value
        // Change docs to different version
        window.location.replace("/" + paperId + "/" + versionId);
        // setDocs([{ uri: paperApi.getDocumentURI(paperId, versionId)}]);
    }

    useEffect(async() => {
        const doc = await paperApi.getMetaDataById(paperId);
        // Getting Document Title
        setDocumentTitle(doc.title);

        // Get Comment Information
        console.log("[CommentList] mount");
        setIsFetching(true);
        // Get Comments for paperId and versionId
        setIsFetching(false);
    }, []);

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
                            {documentTitle}
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
                    <DocumentItems versionId={versionId}/>
                    <h3>Version</h3>
                    <Select
                        labelId="Version Select Label"
                        id="Version Select"
                        label="Version"
                        value={versionId}
                        onChange={(e) => ChangeCurrentVersion(e)}
                    >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                    </Select>
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.appBarSpacer} />
                    <Container maxWidth="lg" className={classes.container}>
                        <Grid container spacing={5}>
                            {/* Document */}
                            <Grid item xs={8}>
                                <DocViewer 
                                    pluginRenderers=
                                    {[
                                        CustomPDFRenderer,
                                        MSDocRenderer,
                                        HTMLRenderer,
                                        JPGRenderer,
                                        PNGRenderer,
                                        TXTRenderer,
                                    ]}
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
                                <TextField variant="outlined" multiline placeholder="Enter Comment Here" fullWidth={true} value={currentComment} onChange={handleType}></TextField>
                                <Button color="primary" variant="contained" fullWidth={true} disabled={currentComment === ""} onClick={handleClick}>
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
