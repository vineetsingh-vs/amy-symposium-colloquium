import { useEffect, useState } from "react";
import clsx from "clsx";

import {
    AppBar,
    Button,
    CssBaseline,
    Drawer,
    Divider,
    IconButton,
    Toolbar,
    Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Person from "@mui/icons-material/Person";
import { DashboardItems } from "../components/listItems";
import PapersTable from "./PapersTable";
import paperApi from "../api/paper";
import { usePaperViewStyles } from "../styles/paperViewStyles";

const PapersView = () => {
    const [username, setUsername] = useState("Default Username");
    const [userID, setUserID] = useState(1);
    const classes = usePaperViewStyles();
    const [toggled, setToggled] = useState(true);
    const [papers, setPapers] = useState([]);

    const handleDrawerToggle = () => {
        setToggled(!toggled);
    };

    useEffect(() => {
        paperApi.getList(userID, "all").then((paperList) => {
            setPapers(paperList);
        });
    }, []);

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="absolute"
                className={clsx(classes.appBar, toggled && classes.appBarShift)}
            >
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerToggle}
                        className={clsx(classes.menuButton, toggled && classes.menuButtonHidden)}
                        size="large"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        component="h1"
                        variant="h6"
                        color="inherit"
                        noWrap
                        className={classes.title}
                    >
                        My Papers
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
                    paper: clsx(classes.drawerPaper, !toggled && classes.drawerPaperClose),
                }}
                open={toggled}
            >
                <div className={classes.toolbarIcon}>
                    <IconButton onClick={handleDrawerToggle} size="large">
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <DashboardItems />
            </Drawer>
            <div className={classes.papersTable}>
                <PapersTable papers={papers} />
            </div>
        </div>
    );
};

export default PapersView;
