import React, { useEffect, useState } from "react";
import DocViewer, {
    HTMLRenderer,
    JPGRenderer,
    PNGRenderer,
    TXTRenderer,
    MSDocRenderer,
} from "react-doc-viewer";
import CustomPDFRenderer from "../renderers/CustomPDFRenderer";
import clsx from "clsx";
import {
    Button,
    CssBaseline,
    Drawer,
    Box,
    AppBar,
    Toolbar,
    Typography,
    Select,
    MenuItem,
    Divider,
    IconButton,
    Container,
    Grid,
    TextField,
} from "@mui/material";
import Menu from "@mui/icons-material/Menu";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import Person from "@mui/icons-material/Person";
import CommentList from "../components/CommentList";
import { DocumentItems } from "../components/listItems";
import Copyright from "../components/Copyright";
import paperApi from "../api/paper";
import { useDocumentViewStyles } from "../styles/documentViewStyles";

const pageContext = {
    currentPage: 1,
};

const ChangeCurrentPage = (page) => {
    pageContext.currentPage = page;
};

const DocumentView = ({ match, history }) => {
    const classes = useDocumentViewStyles();
    const paperId = match.params.paperId;
    let versionId = match.params.versionId;

    const [drawerToggled, setDrawerToggled] = useState(false);

    // Displaying Document
    const [username, setUsername] = useState("Default Username");
    const [comments, setComments] = useState([]);
    const [docUri, setDocUri] = useState([]);
    const [documentTitle, setDocumentTitle] = useState("");

    const [isFetching, setIsFetching] = useState(false);

    // Comment Handling
    const [currentComment, setCurrentComment] = useState("");
    const handleType = (text) => {
        setCurrentComment(text.target.value);
    };

    const handleClick = () => {
        comments.push(createComment(comments.length, username, currentComment, []));
        listComments();
        console.log(comments);
        setCurrentComment("");
    };

    const createComment = (id, name, body, replies) => {
        // Push a comment thing here to backend
        return { id, name, body, replies };
    };

    const listComments = () => {
        let commentList = comments.slice();
        setComments(commentList);
        console.log("[CommentList] got comments");
    };

    const handleDrawerToggle = () => {
        setDrawerToggled(!drawerToggled);
    };

    // Version Control
    const handleChangeVersion = (event) => {
        versionId = event.target.value;
        // Change docs to different version
        window.location.replace("/" + paperId + "/" + versionId);
    };

    useEffect(() => {
        // load document metadata and file version
        paperApi.getMetaDataById(paperId).then((metadata) => setDocumentTitle(metadata.title));
        setDocUri([{ uri: paperApi.getDocumentURI(paperId, versionId) }]);
    }, []);

    if (isFetching) {
        return "Loading...";
    } else {
        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar
                    position="absolute"
                    className={clsx(classes.appBar, drawerToggled && classes.appBarShift)}
                >
                    <Toolbar className={classes.toolbar}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerToggle}
                            className={clsx(
                                classes.menuButton,
                                drawerToggled && classes.menuButtonHidden
                            )}
                            size="large"
                        >
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
                        paper: clsx(classes.drawerPaper, !drawerToggled && classes.drawerPaperClose),
                    }}
                    open={drawerToggled}
                >
                    <div className={classes.toolbarIcon}>
                        <IconButton onClick={handleDrawerToggle} size="large">
                            <ChevronLeft />
                        </IconButton>
                    </div>
                    <Divider />
                    <DocumentItems versionId={versionId} />
                    <h3>Version</h3>
                    <Select
                        labelId="Version Select Label"
                        id="Version Select"
                        label="Version"
                        value={versionId}
                        onChange={(e) => handleChangeVersion(e)}
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
                                    pluginRenderers={[
                                        CustomPDFRenderer,
                                        MSDocRenderer,
                                        HTMLRenderer,
                                        JPGRenderer,
                                        PNGRenderer,
                                        TXTRenderer,
                                    ]}
                                    documents={docUri}
                                    config={{
                                        header: {
                                            disableFileName: true,
                                            disableHeader: true,
                                            retainURLParams: false,
                                        },
                                    }}
                                />
                            </Grid>
                            {/* Comments */}
                            <Grid item xs={4}>
                                <CommentList comments={comments} />
                                <TextField
                                    variant="outlined"
                                    multiline
                                    placeholder="Enter Comment Here"
                                    fullWidth={true}
                                    value={currentComment}
                                    onChange={handleType}
                                ></TextField>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    fullWidth={true}
                                    disabled={currentComment === ""}
                                    onClick={handleClick}
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
};

export { DocumentView, ChangeCurrentPage };
