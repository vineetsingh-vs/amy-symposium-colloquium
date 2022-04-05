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
    Grid,
    IconButton,
    List,
    Toolbar,
    Typography,
    TextField
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import PersonIcon from "@mui/icons-material/Person";
import CommentList from "../components/CommentList";
import { documentItems } from "../components/listItems";
import Copyright from "../components/Copyright";

const drawerWidth = 240;

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

const ReviewView = () => {
    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const [documentTitle, setDocumentTitle] = useState("Document Title");
    const [username, setUsername] = useState("Default Username");
    const [comments, setComments] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [version, setVersion] = useState("");
    const [value, setValue] = useState("");

    const handleType = (text) => {
        setValue(text.target.value);
    }

    const handleClick = () => {
        comments.push(createComment(comments.length, username, value, []));
        listComments();
        console.log(comments);
        setValue("");
    }
    
    const createComment = (id, name, body, replies) => {
        return { id, name,  body, replies};
    }

    const listComments = () => {
        // const url = "https://jsonplaceholder.typicode.com/posts/1/comments";
        // fetch(url)
        //     .then((response) => response.json())
        //     .then((comments) => {
                let commentList = comments.slice();
                setComments(commentList);
                console.log("[CommentList] got comments");
        //     });
    };

    useEffect(() => {
        console.log("[CommentList] mount");
        setIsFetching(true);
        listComments();
        setIsFetching(false);
    }, []);  

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    const docs = [{ uri: require("../TestingData/test.pdf") }];

    const handleChange = (event) => {
        setVersion(event.target.value);
    };

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
                        {documentTitle}
                    </Typography>
                    <Button
                        variant="link"
                        color="inherit"
                        startIcon={<PersonIcon />}
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
                    {/* Reviews */}
                    <Grid item xs={12}>
                    <CommentList comments={comments}/>
                        <TextField variant="outlined" multiline placeholder="Enter Review Here" fullWidth={true} value={value} onChange={handleType}></TextField>
                        <Button color="primary" variant="contained" fullWidth="true" disabled={value == ""} onClick={handleClick}>
                            Add Review
                        </Button>
                    </Grid>
                    <Box pt={4}>
                        <Copyright />
                    </Box>
                </Container>
            </main>
        </div>
    );
};

export default ReviewView;
