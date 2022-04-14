import React, {useState, useEffect} from "react";
import clsx from 'clsx';
import { DocumentItems } from '../components/listItems';
import makeStyles from '@mui/styles/makeStyles';

import {
    TextField,
    Button,
    Table,
    TableRow,
    TableBody,
    TableCell,
    TableHead,
    AppBar,
    CssBaseline,
    Container,
    Drawer,
    Divider,
    Grid,
    IconButton,
    Toolbar,
    Typography,
    Box

} from "@mui/material"

import {
  Menu,
  ChevronLeft,
  Person,
} from "@mui/icons-material"

import Copyright from "../components/Copyright";
import paperApi from "../api/paper";
import { useAuth } from "../useAuth";
import { usePaperUploadViewStyles } from "../styles/paperUploadViewStyles";

const SharingView = ({match, history}) => {
    const classes = usePaperUploadViewStyles();
    const paperId = match.params.paperId;
    let versionId = match.params.versionId;
    const { user } = useAuth();

    // Drawer
    const [open, setOpen] = useState(true);

    // Who is being shared with
    const [rows, setRows] = useState([]);
    const addSharedUser = () => {
      console.log("Add a User");

    };

    const removeSharedUser = () => {
      console.log("Remove a User");

    };

    // Document Info
    const [documentTitle, setDocumentTitle] = useState("");

    // Side Bare Handling
    const handleDrawerOpen = () => {
      setOpen(true);
    };
    
    const handleDrawerClose = () => {
        setOpen(false);
    };

    useEffect(() => {
      async function apiCalls() {
        await paperApi.getMetaDataById(paperId).then((rep) => setDocumentTitle(rep.title));
        // Get Shared Users
        
      }
      apiCalls();
  }, []);

    return (
        <div className={classes.root}>
        <CssBaseline />
        <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
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
                <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                    Share "{documentTitle}":
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
                <IconButton onClick={handleDrawerClose}>
                    <ChevronLeft />
                </IconButton>
            </div>
            <Divider />
            <DocumentItems versionId={versionId}/>
        </Drawer>
        <main className={classes.content}>
            <div className={classes.appBarSpacer}>
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={12} lg={12}>
                            <TextField fullWidth label='Enter an Email Address'></TextField>
                            <Button variant="contained" color="primary" onClick={addSharedUser} href={"/" + paperId + "/" + versionId + "/share"}>
                                Share With
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Shared With</TableCell>
                                        <TableCell>Remove Share?</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell>
                                                {row.shareName}
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="contained" color="secondary" href={"/" + paperId + "/" + versionId + "/share"} onClick={removeSharedUser}>Remove?</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
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


export default SharingView;

