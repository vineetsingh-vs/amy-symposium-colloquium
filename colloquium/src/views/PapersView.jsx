import { useEffect, useState } from "react";
import clsx from "clsx";

import {
    AppBar,
    Link,
    Button,
    CssBaseline,
    List,
    ListItem,
    ListItemIcon,
    Drawer,
    Divider,
    IconButton,
    Toolbar,
    Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from '@mui/icons-material/Logout';
import Assignment from "@mui/icons-material/Assignment";
import People from "@mui/icons-material/People";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import SearchIcon from '@mui/icons-material/Search';
import Person from "@mui/icons-material/Person";
import PapersTable from "./PapersTable";
import paperApi from "../api/paper";
import { usePaperViewStyles } from "../styles/paperViewStyles";
import Copyright from "../components/Copyright";
import { useAuth } from "../useAuth";

const PapersView = () => {
    const classes = usePaperViewStyles();
    const [drawerToggled, setDrawerToggled] = useState(true);
    const [filter, setFilter] = useState("uploaded");
    const [title, setTitle] = useState("My Papers");
    const [papers, setPapers] = useState([]);
    const { user, logout } = useAuth();
    const site = "Colloquium";

    // const handleDrawerToggle = () => {
    //     setDrawerToggled(true);
    // };

    // get filtered papers on mount and everytime filter state is updated
    useEffect(() => {
        paperApi.getList(filter).then((paperList) => {
            if(paperList){
                setPapers(paperList);
            }
            else {
                setPapers([]);
            }
        });
        if (filter === "uploaded") setTitle("My Papers");
        if (filter === "shared") setTitle("Shared With Me");
        if (filter === "published") setTitle("Published Papers");
    }, [filter]);

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
                        //onClick={handleDrawerToggle}
                        className={clsx(
                            classes.menuButton,
                            drawerToggled && classes.menuButtonHidden
                        )}
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
                        {title}
                    </Typography>
                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<Person />}
                        href="/userprofile"
                    >
                        {user.firstName}
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<LogoutIcon />}
                        onClick={logout}
                    >
                        Logout
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
                <div className={classes.colloquium}>
                    <Link href={"/"} underline="hover">
                        Colloquium
                    </Link>
                </div>
                <Divider />
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <Assignment />
                        </ListItemIcon>
                        <Link onClick={() => setFilter("published")} underline="hover">
                            Published
                        </Link>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <People />
                        </ListItemIcon>
                        <Link onClick={() => setFilter("shared")} underline="hover">
                            Shared With Me
                        </Link>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <Person />
                        </ListItemIcon>
                        <Link onClick={() => setFilter("uploaded")} underline="hover">
                            My Papers
                        </Link>
                    </ListItem>
                </List>
            </Drawer>
            <div className={classes.papersTable}>
                <PapersTable papers={papers} filter={filter} user={user} />
            </div>
            <div pt={4}>
                <Copyright />
            </div>
        </div>
    );
};

export default PapersView;
