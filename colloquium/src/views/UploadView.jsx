import React from 'react';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
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
    Typography
} from '@mui/material';
import paperApi from '../api/paper';
import {
    Menu,
    ChevronLeft,
    People,
    Person,
    Assignment
} from "@mui/icons-material"
import { dashboardItems } from '../components/listItems';
import Copyright from "../components/Copyright";




const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(4),
  },
  fixedHeight: {
    height: 240,
  },
}));


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
    const [author, setAuthor] = React.useState([]);
    const [documentTitle, setDocumentTitle] = React.useState("Default Document");
    const [shared, setShared] = React.useState([]);
    const [files, setFiles] = useState();
    
    const [upload, setUpload] = React.useState(true);
    const handleUpload = (event) => {
        setUpload(false);
        setFiles(event.target.files);
    }

    // Submitting the document through a form
    const handleSubmission = async () => {
      const form = new FormData();
      form.append("title", documentTitle);
      form.append("author", author);
      for (let i = 0; i < files.length; i++) {
          form.append("files", files[i], files[i].name);
      }
      paperApi.create(form);
  };

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
              {dashboardItems}
          </Drawer>
          <main className = {classes.content}>
              <div className={classes.appBarSpacer} >
                  
                  <Container maxWidth="lg" className={classes.container}>
                      <Grid container spacing={3}>

                          <Grid item xs={12} md={12} lg={12}>
                              <TextField id="docTitle" required label="Document Title" variant="outlined" onChange={(event) => setDocumentTitle(event.target.value)}/>  
                              {/* <TextField id="sharedWith" required label="Share With" variant="outlined" onChange={(event) => setShared(event.target.value)}/> */}
                              <TextField id="authors" required label="Author(s)" variant="outlined" onChange={(event) => setAuthor(event.target.value)}/> 
                          </Grid>
                      
                          <Grid item xs={12} md={12} lg={12}>
                              <label htmlFor="contained-button-file">
                                  <Input accept="*" id="contained-button-file" multiple type="file" onChange={(event) => handleUpload(event)}/>
                              </label>
                          </Grid>

                          <Grid item xs={12} md={12} lg={12}>
                              <Button color="primary" variant="contained" component="span" disabled={upload} onClick={handleSubmission()}>
                                  Submit
                              </Button>
                          </Grid>

                        </Grid>
                      <Box pt={4}>
                          <Copyright />
                      </Box>
                  </Container>
              </div>
          </main>
      </div>
    )
}

export default UploadPaperView;