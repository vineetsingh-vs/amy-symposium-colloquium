import React, { useState } from "react";
import clsx from "clsx";
import makeStyles from "@mui/styles/makeStyles";
import {
    AppBar,
    Button,
    Box,
    TextField,
    CssBaseline,
    Container,
    Drawer,
    Divider,
    Grid,
    IconButton,
    Link,
    List,
    ListItem,
    ListItemIcon,
    Toolbar,
    Input,
    Typography,
    FormControl,
    FormGroup,
} from "@mui/material";
import paperApi from "../api/paper";
import { Menu, ChevronLeft, People, Person, Assignment } from "@mui/icons-material";
import { DashboardItems } from "../components/listItems";
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
        paddingTop: theme.spacing(10),
        paddingBottom: theme.spacing(4),
    },
    fixedHeight: {
        height: 240,
    },
}));

// DOES NOT INCLUDE MICROSOFT DOC/XLSX/PPTX
const acceptedDocumentTypes = [
    "text/htm",
    "text/html",
    "image/jpg",
    "image/jpeg",
    "application/pdf",
    "image/png",
    "text/plain"
];


const UploadPaperView = () => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const [username, setUsername] = React.useState("Default Username");

    // Form Data
    const [author, setAuthor] = useState("");
    const [documentTitle, setDocumentTitle] = useState("");
    const [shared, setShared] = useState([]);
    const [files, setFiles] = useState([]);

    const clearValues = () => {
      setDocumentTitle("");
      setAuthor("");
    };

    // Submitting the document through a form
    const handleSubmission = async (event) => {
      event.preventDefault();
      let result = true;
      for (let i = 0; i < files.length; i++) {
        result = acceptedDocumentTypes.find((docTypes) => docTypes.includes(files[i].type));
        if(result) break;
      }

      if(result){
        const form = new FormData();
        form.append("title", documentTitle);
        form.append("authors", "{"+author+"}");
        form.append("creator_id", 1);
        form.append("tags", "{}");
        form.append("revisions", "{}");
        for (let i = 0; i < files.length; i++) {
            form.append("files", files[i], files[i].name);
            console.log(files[i])
        }

        const response = await paperApi.create(form);
        window.location.replace("/mypapers");   
      }
      else {
        clearValues();
        return (
          alert("This document is not supported at this time")
        );
      }
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
                        Upload Document
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
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeft />
                    </IconButton>
                </div>
                <Divider />
                <DashboardItems />
            </Drawer>
            <main className={classes.content}>
                <div className={classes.appBarSpacer}>
                    <Container maxWidth="lg" className={classes.container}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={12} lg={12}>
                                <FormGroup>
                                    <Input
                                        type="text"
                                        placeholder="Document Title"
                                        value={documentTitle}
                                        onChange={(e) => setDocumentTitle(e.target.value)}
                                    />
                                    <Input
                                        type="text"
                                        placeholder="Author"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                    />
                                    <br />
                                    <Input
                                        type="file"
                                        onChange={(e) => setFiles(e.target.files)}
                                    />
                                    <br />
                                    <Input type="submit" onClick={handleSubmission} />
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

export default UploadPaperView;
