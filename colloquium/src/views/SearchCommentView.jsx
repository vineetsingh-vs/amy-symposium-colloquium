import React, { useEffect, useState } from "react";
import clsx from "clsx";
import {
    AppBar,
    MenuItem,
    Select,
    Button,
    Box,
    CssBaseline,
    Container,
    Drawer,
    Divider,
    IconButton,
    Toolbar,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Grid,
    InputLabel,
    TextField,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Person from "@mui/icons-material/Person";
import { ReviewList } from "../components/CommentList";
import { DocumentItems, CreatorItems } from "../components/listItems";
import Copyright from "../components/Copyright";
import paperApi from "../api/paper"
import { useAuth } from "../useAuth";
import { useDocumentViewStyles } from "../styles/documentViewStyles";
import commentApi from "../api/comment";
import { usePaperTableStyles, usePaperViewStyles } from "../styles/paperViewStyles";

const SearchCommentView = ({ match, history }) => {
    const classes = useDocumentViewStyles();
    const classes2 = usePaperTableStyles();
    const paperId = match.params.paperId;
    let versionId = match.params.versionId;
    const [filter, setFilter] = useState("search");
    const [title, setTitle] = useState("Comment Searching");
    const [comments, setComments] = useState([]);
    const { user } = useAuth();
    const [searchInput, setSearchInput] = useState("");
    const [SearchParam, setSearchParam] = useState("Owner");
    const [creatorAccess, setCreatorAccess] = useState(false);

    // Drawer
    const [open, setOpen] = useState(false);

    // Document Info
    const [documentTitle, setDocumentTitle] = useState("");
    const [displayVersions, setDisplayVersions] = useState([]);

    // Version Control
    const handleChangeVersion = (event) => {
        versionId = event.target.value;

        window.location.replace("/" + paperId + "/" + versionId + "/search");
    }

    // Side Bar Handling
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const searchParamChange = (event) => {
        setSearchParam(event.target.value);
    };

    let inputHandler = (e) => {
        var lowerCase = e.target.value.toLowerCase();
        setSearchInput(lowerCase);
    };

    const containsAuthor = (authorsList, searchInput) => {
        for (let i = 0; i < authorsList.length; i++) {
            if (authorsList.toLowerCase().includes(searchInput.toLowerCase())) {
                return true;
            }
        }
        return false;
    };

    const containsContent = (content, searchInput) => {
        for (let i = 0; i < content.length; i++) {
            if (content.toLowerCase().includes(searchInput.toLowerCase())) {
                return true;
            }
        }
        return false;
    };

    const containsPage = (pageList, searchInput) => {
        let a = parseInt(searchInput);
        if (isNaN(a)) {
            return false;
        }
        // for (let i = 0; i < pageList.length; i++) {
        if (parseInt(pageList) == a) {
            return true;
        }
        // }
        return false;
    };

    useEffect(() => {
        paperApi.getMetaDataById(paperId).then((metadata) => {
            // First check to make sure the user is allowed on this document
            let owner = false;
            let shared = false;
            if (metadata.creator.id === user.id) {
                owner = true;
            }
            for (let i = 0; i < metadata.sharedWith.length; i++) {
                if (metadata.sharedWith[i].id === user.id) {
                    shared = true;
                }
            }

            // If the paper is not published, the user is not the owner or has share privliages,
            // Send them away from this document
            if (!owner && !shared) {
                if (!metadata.isPublished) {
                    window.location.replace("/papers");
                }
            }

            let temp = []
            for (let version = 1; version <= metadata.versionNumber; version++) {
                temp.push(version);
            }
            setDisplayVersions(temp);
            setDocumentTitle(metadata.title);
            if (metadata.creator.id === user.id) {
                setCreatorAccess(true);
            }
        });
    }, []);

    useEffect(() => {
        commentApi.getCommentsByPaperVersion(paperId, versionId).then((commentList) => {
            if (commentList) {
                setComments(commentList);
            }
            else {
                setComments([]);
            }
        });
    }, [filter]);

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
                        className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                        size="large">
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        component="h1"
                        variant="h6"
                        color="inherit"
                        noWrap
                        className={classes.title}
                    >
                        {title}
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
                    <IconButton onClick={handleDrawerClose} size="large">
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <DocumentItems versionId={versionId} />
                {creatorAccess ? (<CreatorItems versionId={versionId} />) : (<></>)}
                <h3>Version</h3>
                <Select
                    labelId="Version Select Label"
                    id="Version Select"
                    label="Version"
                    value={versionId}
                    onChange={(e) => handleChangeVersion(e)}
                >
                    {displayVersions.map((version) => (
                        <MenuItem
                            key={version}
                            value={version}
                        >
                            {version}
                        </MenuItem>
                    ))}
                </Select>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    {/* Reviews */}
                    <Container maxWidth="lg" className={classes2.container}>
                        <Grid container spacing={3}>

                            <Grid item xs={10} md={10} lg={10}>
                                <InputLabel>Search</InputLabel>
                                <TextField
                                    id="outlined-basic"
                                    onChange={inputHandler}
                                    variant="outlined"
                                    fullWidth
                                />

                            </Grid>
                            <Grid item xs={2} md={2} lg={2}>
                                <InputLabel>Search By</InputLabel>
                                <Select
                                    value={SearchParam}
                                    label="Search By"
                                    onChange={searchParamChange}
                                >
                                    <MenuItem value={"Owner"}>Author</MenuItem>
                                    <MenuItem value={"Content"}>Content</MenuItem>
                                    <MenuItem value={"Page"}>Page Number</MenuItem>
                                </Select>
                            </Grid>

                            <Grid item xs={12} md={12} lg={12}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Author</TableCell>
                                            <TableCell>Content</TableCell>
                                            <TableCell>Page Number</TableCell>

                                        </TableRow>
                                    </TableHead>
                                    {searchInput !== "" ? (

                                        <TableBody>
                                            {/* Filtering of Comments */}
                                            {comments.map((comments) => (

                                                <TableRow>

                                                    {(SearchParam == "Owner" && containsAuthor(comments.user, searchInput)) || (SearchParam == "Content" && containsContent(comments.content, searchInput)) || (SearchParam == "Page" && containsPage(comments.pageNum, searchInput)) ? (

                                                        <TableCell>
                                                            <React.Fragment>{comments.user}</React.Fragment>
                                                        </TableCell>
                                                    ) : (
                                                        <></>
                                                    )}

                                                    {(SearchParam == "Owner" && containsAuthor(comments.user, searchInput)) || (SearchParam == "Content" && containsContent(comments.content, searchInput)) || (SearchParam == "Page" && containsPage(comments.pageNum, searchInput)) ? (

                                                        <TableCell>
                                                            <React.Fragment>{comments.content}</React.Fragment>
                                                        </TableCell>
                                                    ) : (
                                                        <></>
                                                    )}

                                                    {(SearchParam == "Owner" && containsAuthor(comments.user, searchInput)) || (SearchParam == "Content" && containsContent(comments.content, searchInput)) || (SearchParam == "Page" && containsPage(comments.pageNum, searchInput)) ? (

                                                        <TableCell>
                                                            <React.Fragment>{comments.pageNum}</React.Fragment>
                                                        </TableCell>
                                                    ) : (
                                                        <></>
                                                    )}


                                                </TableRow>
                                            ))}
                                            <></>
                                        </TableBody>


                                    ) : (
                                        <></>
                                    )}
                                </Table>
                            </Grid>
                        </Grid>
                    </Container>
                    <Box pt={4}>
                        <Copyright />
                    </Box>
                </Container>
            </main>
        </div>
    );
};

export default SearchCommentView;
