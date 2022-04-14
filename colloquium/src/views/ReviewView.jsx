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
import Person from "@mui/icons-material/Person";
import { ReviewList } from "../components/CommentList";
import { DocumentItems } from "../components/listItems";
import Copyright from "../components/Copyright";
import paperApi from "../api/paper"
import commentApi from "../api/comment";
import { useAuth } from "../useAuth";
import {useDocumentViewStyles} from "../styles/documentViewStyles";

const ReviewView = ({match, history}) => {
    const classes = useDocumentViewStyles();
    const paperId = match.params.paperId;
    let versionId = match.params.versionId;
    const { user } = useAuth()

    // Drawer
    const [open, setOpen] = useState(false);

    // Document Info
    const [documentTitle, setDocumentTitle] = useState("");
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
