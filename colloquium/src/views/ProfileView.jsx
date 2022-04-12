import { useState } from "react";
import clsx from "clsx";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import PersonIcon from "@mui/icons-material/Person";
import TextField from "@mui/material/TextField";
import {SecondaryListItems} from "../components/listItems";
import Copyright from "../components/Copyright";
import {useUserProfileStyles} from "../styles/userProfileStyles.js"
import { useAuth } from "../useAuth"


const ProfileView = () => {
    const classes = useUserProfileStyles();
    const { user } = useAuth()
    const [drawerToggled, setDrawerToggled] = useState(false);
    const [description, setDescription] = useState("Default Description");
    const [editing, setEditing] = useState(false);

    const handleDrawerToggle = () => {
        setDrawerToggled(!drawerToggled);
    };

    const handleEditing = () => {
        setEditing(!editing);
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
                        className={clsx(classes.menuButton, drawerToggled && classes.menuButtonHidden)}
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
                        User Profile
                    </Typography>
                    <Button variant="link" color="inherit" startIcon={<PersonIcon />} href="/">
                        {user.firstName}
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
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <SecondaryListItems/>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    {/* Profile */}
                    <h1>About Me</h1>
                    <TextField
                        fullWidth
                        id="description"
                        disabled={!editing}
                        placeholder={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        id="editButton"
                        onClick={handleEditing}
                    >
                        {editing ? "Save Edits" : "Edit Description"}
                    </Button>
                    <Box pt={4}>
                        <Copyright />
                    </Box>
                </Container>
            </main>
        </div>
    );
};

export default ProfileView;
