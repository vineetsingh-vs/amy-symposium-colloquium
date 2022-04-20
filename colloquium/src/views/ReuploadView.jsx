import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import clsx from "clsx";
import {
    AppBar,
    Button,
    Box,
    CssBaseline,
    Container,
    Drawer,
    Divider,
    Grid,
    IconButton,
    Toolbar,
    Input,
    Typography,
    FormGroup,
    CircularProgress,
} from "@mui/material";
import paperApi from "../api/paper";
import { Menu, ChevronLeft, Person } from "@mui/icons-material";
import { DocumentItems, CreatorItems } from "../components/listItems";
import Copyright from "../components/Copyright";
import { useAuth } from "../useAuth";
import { usePaperUploadViewStyles } from "../styles/paperUploadViewStyles";

const acceptedDocumentTypes = [
    "text/htm",
    "text/html",
    "image/jpg",
    "image/jpeg",
    "application/pdf",
    "image/png",
    "text/plain",
];

const ReuploadView = () => {
    const classes = usePaperUploadViewStyles();
    const {user} = useAuth();
    const {paperId, versionId} = useParams();
    const history = useHistory();
    const [drawerToggled, setDrawerToggled] = useState(false);
    const [creatorAccess, setCreatorAccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDrawerToggle = () => {
        setDrawerToggled(!drawerToggled);
    };

    // Form Data
    const [files, setFiles] = useState([]);

    const nextVersionDisplay = () => {
        paperApi.getMetaDataById(paperId).then((metadata) => {
            history.push(`/${paperId}/${metadata.versionNumber}`)
        });
    }

    // Submitting the document through a form
    const handleSubmission = async (event) => {
        event.preventDefault();
        setLoading(true);
        let result = true;
        for (let i = 0; i < files.length; i++) {
            result = acceptedDocumentTypes.find((docTypes) =>
                docTypes.includes(files[i].type)
            );
            if (result) break;
        }

        if (result) {
            const form = new FormData();
            for (let i = 0; i < files.length; i++) {
                form.append("files", files[i], files[i].name);
            }
            await paperApi.updateFileVersion(paperId, user.id, form).then();
            setLoading(false);
            nextVersionDisplay();
        } else {
            return alert("This document is not supported at this time");
        }
    };

    useEffect(() => {
        paperApi.getMetaDataById(paperId).then((metadata) => {
            // First, check that the user is allowed on the document
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

            // Only the owner has access to the share screen at any point for the document
            if(!owner) {
                if(shared || metadata.isPublished) {
                    // If its shared, or public, send the user back to the doc view for the document
                    window.location.replace("/" + paperId + "/" + versionId);
                } else {
                    window.location.replace("/papers");
                } 
            }

            if(metadata.creator.id === user.id) {
                setCreatorAccess(true);
            }
        });      
    }, []);

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
                        Reupload Document
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
                    paper: clsx(
                        classes.drawerPaper,
                        !drawerToggled && classes.drawerPaperClose
                    ),
                }}
                open={drawerToggled}
            >
                <div className={classes.toolbarIcon}>
                    <IconButton onClick={handleDrawerToggle}>
                        <ChevronLeft />
                    </IconButton>
                </div>
                <Divider />
                <DocumentItems versionId={versionId} />
                {creatorAccess ? (<CreatorItems versionId={versionId} />) : (<></>)}
            </Drawer>
            <main className={classes.content}>
                <div className={classes.appBarSpacer}>
                    <Container maxWidth="lg" className={classes.container}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={12} lg={12}>
                                <FormGroup>
                                    <Input
                                        type="file"
                                        disabled={loading}
                                        onChange={(e) => setFiles(e.target.files)}
                                    />
                                    <br />
                                    { loading ? <CircularProgress /> : <Input type="submit" disabled={!(files.length !== 0)} onClick={handleSubmission} /> }
                                </FormGroup>
                            </Grid>
                        </Grid>
                        <Box pt={4}>
                            <Copyright />
                        </Box>
                    </Container>
                </div>
            </main>
        </div>
    );
};

export default ReuploadView;
