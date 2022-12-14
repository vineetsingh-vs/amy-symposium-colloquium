import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import DocViewer, {
    HTMLRenderer,
    JPGRenderer,
    PNGRenderer,
    TXTRenderer,
} from "react-doc-viewer";
import CustomPDFRenderer from "../renderers/CustomPDFRenderer";
import CustomMSDocRenderer from "../renderers/CustomMSDocRenderer";
import clsx from "clsx";
import {
    Button,
    CssBaseline,
    Drawer,
    Box,
    AppBar,
    Toolbar,
    Typography,
    Select,
    MenuItem,
    Divider,
    IconButton,
    Container,
    Grid,
} from "@mui/material";
import Menu from "@mui/icons-material/Menu";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import Person from "@mui/icons-material/Person";
import Link from "@mui/material/Link";
import { CommentList } from "../components/CommentList";
import { DocumentItems, CreatorItems } from "../components/listItems";
import Copyright from "../components/Copyright";
import paperApi from "../api/paper";
import { createStore } from "redux";
import {useDocumentViewStyles} from "../styles/documentViewStyles";
import { useAuth } from "../useAuth";
import path from "path-browserify";


function pageReducer(state = { currentPage: 1 }, action) {
    switch (action.type) {
        case "Page_Change":
            return { currentPage: action.newPage };
        default:
            return state;
    }
}
const PageStore = createStore(pageReducer);

const DocumentView = () => {
    const classes = useDocumentViewStyles();
    const {paperId, versionId} = useParams();
    const { user } = useAuth()
    const [drawerToggled, setDrawerToggled] = useState(true);
    const [docUri, setDocUri] = useState([]);
    const [documentTitle, setDocumentTitle] = useState("");
    const [isFetching, setIsFetching] = useState(false);
    const [displayVersions, setDisplayVersions] = useState([]);
    const [fileType, setFileType] = useState("");
    const [creatorAccess, setCreatorAccess] = useState(false);
    const site = "Colloquium";


    const handleChangeVersion = (event) => {
        const newVersionId = event.target.value;
        window.location.replace("/" + paperId + "/" + newVersionId);
    };

    //PageStore.subscribe(() => {if (currentPage !== PageStore.getState().currentPage) setCurrentPage(PageStore.getState().currentPage); });

    useEffect(() => {
        // load document metadata and file version
        paperApi.getMetaDataById(paperId).then((metadata) => {
            setFileType(path.extname(metadata.versions[metadata.versionNumber - 1].filePath))
            
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

            let temp = [];
            for(let version = 1; version <= metadata.versionNumber; version++){
                temp.push(version);
            }
            if (fileType !== ".pdf") {
                PageStore.dispatch({ type: "Page_Change", newPage: 1 });
            }
            setDisplayVersions(temp);
            setDocumentTitle(metadata.title);
            setIsFetching(false);
            if(metadata.creator.id === user.id) {
                setCreatorAccess(true);
            }
        });
        setDocUri([{ uri: paperApi.getDocumentURI(paperId, versionId) }]);
        
    }, []);

    if (isFetching) {
        return "Loading...";
    } else {
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
                            className={clsx(
                                classes.menuButton,
                                drawerToggled && classes.menuButtonHidden
                            )}
                            size="large"
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
                        paper: clsx(classes.drawerPaper, !drawerToggled && classes.drawerPaperClose),
                    }}
                    open={drawerToggled}
                >
                    <div className={classes.colloquium}>
                        <Link href={"/"} underline="hover">
                            Colloquium
                        </Link>
                    </div>
                    <Divider />
                    <DocumentItems versionId={versionId} />
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
                        <Grid container spacing={5}>
                            {/* Document */}
                            <Grid item xs={8}>
                                <DocViewer
                                    pluginRenderers={[
                                        CustomPDFRenderer,
                                        CustomMSDocRenderer,
                                        HTMLRenderer,
                                        JPGRenderer,
                                        PNGRenderer,
                                        TXTRenderer,
                                    ]}
                                    documents={docUri}
                                    config={{
                                        header: {
                                            disableFileName: true,
                                            retainURLParams: false,
                                            disableHeader: false,
                                        },
                                    }}
                                />
                            </Grid>
                            {/* Comments */}
                            <CommentList paperId={paperId} versionId={versionId} />
                        </Grid>
                        <Box pt={4}>
                            <Copyright />
                        </Box>
                    </Container>
                </main>
            </div>
        );
    }
};

export { DocumentView, PageStore };
