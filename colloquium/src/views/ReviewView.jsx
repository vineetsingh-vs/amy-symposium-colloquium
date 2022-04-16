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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Person from "@mui/icons-material/Person";
import { ReviewList } from "../components/CommentList";
import { DocumentItems, CreatorItems } from "../components/listItems";
import Copyright from "../components/Copyright";
import paperApi from "../api/paper"
import { useAuth } from "../useAuth";
import {useDocumentViewStyles} from "../styles/documentViewStyles";

const ReviewView = ({match, history}) => {
    const classes = useDocumentViewStyles();
    const paperId = match.params.paperId;
    let versionId = match.params.versionId;
    const { user } = useAuth()
    const [creatorAccess, setCreatorAccess] = useState(false);

    // Drawer
    const [open, setOpen] = useState(false);

    // Document Info
    const [documentTitle, setDocumentTitle] = useState("");
    const [displayVersions, setDisplayVersions] = useState([]);

    // Version Control
    const handleChangeVersion = (event) => {
        versionId = event.target.value;

        window.location.replace("/" + paperId + "/" + versionId + "/reviews");
    }
    
    useEffect(() => {
        async function apiCalls() {
            await paperApi.getMetaDataById(paperId).then((metadata) => {
                // First check to make sure the user is allowed on this document
                let owner = false;
                let shared = false;
                if(metadata.creator.id === user.id){
                    owner = true;
                }
                for(let i = 0; i < metadata.sharedWith.length; i++){
                    if(metadata.sharedWith[i].id === user.id){
                        shared = true;
                    }
                }

                // If the paper is not published, the user is not the owner or has share privliages,
                // Send them away from this document
                if(!owner && !shared) {
                    if(!metadata.isPublished){
                        window.location.replace("/papers");
                    }
                }

                let temp = []
                for(let version = 1; version <= metadata.versionNumber; version++){
                    temp.push(version);
                }
                setDisplayVersions(temp);
                setDocumentTitle(metadata.title);
                if(metadata.creator.id === user.id) {
                    setCreatorAccess(true);
                }
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
