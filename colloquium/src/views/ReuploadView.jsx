import React, { useState } from "react";
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
} from "@mui/material";
import paperApi from "../api/paper";
import { Menu, ChevronLeft, Person } from "@mui/icons-material";
import { DocumentItems } from "../components/listItems";
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
                // console.log(files[i]);
            }
            await paperApi.updateFileVersion(paperId, form);
            nextVersionDisplay();
        } else {
            return alert("This document is not supported at this time");
        }
    };

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
            </Drawer>
            <main className={classes.content}>
                <div className={classes.appBarSpacer}>
                    <Container maxWidth="lg" className={classes.container}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={12} lg={12}>
                                <FormGroup>
                                    <Input
                                        type="file"
                                        onChange={(e) => setFiles(e.target.files)}
                                    />
                                    <br />
                                    <Input type="submit" disabled={!(files.length !== 0)} onClick={handleSubmission} />
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
