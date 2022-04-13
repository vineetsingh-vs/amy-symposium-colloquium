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
    Toolbar,
    Typography,
    TextField
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import PersonIcon from "@mui/icons-material/Person";
import { ReviewList } from "../components/CommentList";
import { DocumentItems } from "../components/listItems";
import Copyright from "../components/Copyright";
import paperApi from "../api/paper"
import commentApi from "../api/comment";

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

const ReviewView = ({match, history}) => {
    const classes = useStyles();
    const paperId = match.params.paperId;
    let versionId = match.params.versionId;

    // Drawer
    const [open, setOpen] = useState(false);

    // Document Info
    const [documentTitle, setDocumentTitle] = useState("");
    const [username, setUsername] = useState("Default Username");
    const [totalVersions, setTotalVersions] = useState(1);
    const [displayVersions, setDisplayVersions] = useState([]);

    // Version Control
    const handleChangeVersion = (event) => {
        versionId = event.target.value;

        window.location.replace("/" + paperId + "/" + versionId + "/reviews");
    }
    
    useEffect(() => {
        async function apiCalls() {
            await paperApi.getMetaDataById(paperId).then((metadata) => {
                let temp = []
                for(let version = 1; version <= metadata.versionNumber; version++){
                    temp.push(version);
                }
                setDisplayVersions(temp);
                setDocumentTitle(metadata.title)
            });
        }
        apiCalls();
    }, []);  

    // Side Bar Handling
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
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
                <DocumentItems versionId={versionId}/>
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
                    <ReviewList paperId={paperId} versionId={versionId} />
                    <Box pt={4}>
                        <Copyright />
                    </Box>
                </Container>
            </main>
        </div>
    );
};

export default ReviewView;
