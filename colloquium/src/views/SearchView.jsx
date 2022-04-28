import { useEffect, useState } from "react";
import clsx from "clsx";
import React from "react";
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
    Grid,
    InputLabel,
    TextField,
    Container,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Switch,
    FormControlLabel,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Person from "@mui/icons-material/Person";
import paperApi from "../api/paper";
import { usePaperTableStyles, usePaperViewStyles } from "../styles/paperViewStyles";
import Copyright from "../components/Copyright";
import { useAuth } from "../useAuth";
import Dashboard from '@mui/icons-material/Dashboard';

const convertNiceDate = (badDate) => {
    let date = new Date(badDate);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();

    if (dt < 10) {
        dt = "0" + dt;
    }
    if (month < 10) {
        month = "0" + month;
    }

    return year + "-" + month + "-" + dt;
};

const SearchView = () => {

    const classes = usePaperViewStyles();
    const classes2 = usePaperTableStyles();
    const [drawerToggled, setDrawerToggled] = useState(false);
    const [filter, setFilter] = useState("search");
    const [title, setTitle] = useState("My Papers");
    const [papers, setPapers] = useState([]);
    const { user, logout } = useAuth();
    const [searchInput, setSearchInput] = useState("");
    const [SearchParam, setSearchParam] = useState("Content");



    const handleDrawerToggle = () => {
        setDrawerToggled(!drawerToggled);
    };

    let inputHandler = (e) => {
        var lowerCase = e.target.value.toLowerCase();
        setSearchInput(lowerCase);
    };

    const searchParamChange = (event) => {
        setSearchParam(event.target.value);
    };

    const containsAuthor = (authorsList, searchInput) => {
        for (let i = 0; i < authorsList.length; i++) {
            if (authorsList[i].toLowerCase().includes(searchInput.toLowerCase())) {
                return true;
            }
        }
        return false;
    };

    // get filtered papers on mount and everytime filter state is updated
    useEffect(() => {
        paperApi.getList(user.id, filter).then((paperList) => {
            if (paperList) {
                setPapers(paperList);
            }
            else {
                setPapers([]);
            }
        });
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
                        onClick={handleDrawerToggle}
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
                        {"Search Papers and Comments"}
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
                <div className={classes.toolbarIcon}>
                    <IconButton onClick={handleDrawerToggle} size="large">
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <Dashboard />
                        </ListItemIcon>
                        <Link href="/papers" underline="hover">
                            Dashboard
                        </Link>
                    </ListItem>
                </List>
            </Drawer>
            <div className={classes.papersTable}>
                <div className={classes2.appBarSpacer}>
                    <Container maxWidth="lg" className={classes2.container}>
                        <Grid container spacing={3}>

                            <Grid item xs={10} md={10} lg={10}>
                                <InputLabel>Search</InputLabel>
                                <TextField
                                    id="outlined-basic"
                                    onChange={inputHandler}
                                    variant="outlined"
                                    fullWidth
                                />

                            </Grid>
                            <Grid item xs={2} md={2} lg={2}>
                                <InputLabel>Search By</InputLabel>
                                <Select
                                    value={SearchParam}
                                    label="Search By"
                                    onChange={searchParamChange}
                                >
                                    <MenuItem value={"Content"}>Content</MenuItem>
                                    <MenuItem value={"Owner"}>Author</MenuItem>
                                </Select>
                            </Grid>

                            <Grid item xs={12} md={12} lg={12}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Document Title</TableCell>
                                            <TableCell>Document Owner</TableCell>
                                            <TableCell>Most Recent Edit</TableCell>

                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {papers.map((paper) => (

                                            <TableRow key={paper.id}>
                                                {true || searchInput !== "" && containsAuthor(paper.authors, searchInput) ? (
                                                    <TableCell>
                                                        <Link
                                                            href={
                                                                "/" + paper.id + "/" + paper.versionNumber
                                                            }
                                                            underline="hover"
                                                        >
                                                            {paper.title}
                                                        </Link>
                                                    </TableCell>
                                                ) : (
                                                    <></>
                                                )}

                                                {searchInput !== "" && containsAuthor(paper.authors, searchInput) ? (
                                                    <TableCell>
                                                        <React.Fragment>{paper.authors}</React.Fragment>
                                                    </TableCell>
                                                ) : (
                                                    <></>
                                                )}

                                                {searchInput !== "" && containsAuthor(paper.authors, searchInput) ? (
                                                    <TableCell>
                                                        {convertNiceDate(paper.updatedAt)}
                                                    </TableCell>
                                                ) : (
                                                    <></>
                                                )}

                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Grid>

                        </Grid>
                    </Container>
                </div>
            </div>


            <div pt={4}>
                <Copyright />
            </div>
        </div>
    );
};
export default SearchView;