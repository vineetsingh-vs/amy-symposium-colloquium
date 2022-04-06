import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AdminDashboard from "./views/AdminDashboard";
import PageNotFound from "./views/PageNotFound";
import LoginView from "./views/LoginView";
import SharingView from "./views/SharingView";
import {DocumentView} from "./views/DocumentView";
import {MyPapersView} from "./views/MyPapersView";
import SharedView from "./views/SharedView";
import PublishView from "./views/PublishView";
import ReviewView from "./views/ReviewView";
import ProfileView from "./views/ProfileView";
import UploadView from "./views/UploadView";
import ReuploadView from "./views/ReuploadView";
import SignUp from "./views/SignUpView"
import "./App.css";
import { ThemeProvider, StyledEngineProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

function App() {
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
            <Router>
                <div className="mainContainer">
                    <Switch>
                        {/* Admin Page of Users */}
                        <Route exact path="/admin" component={AdminDashboard} />
                        <Route exact path="/userprofile" component={ProfileView} />

                        {/* Log in Page */}
                        <Route exact path="/" component={LoginView} />
                        <Route exact path="/signup" component={SignUp} />

                        {/* <Route exact path="/:paperId/:versionId/comments" component={CommentView} /> */}

                        {/* Main User Screens */}
                        <Route exact path="/published" component={PublishView} />
                        <Route exact path="/shared" component={SharedView} />
                        <Route exact path="/mypapers" component={MyPapersView} />

                        {/* Document Addition Views */}
                        <Route exact path="/:paperId/:versionId/share" component={SharingView} />
                        <Route exact path="/:paperId/:versionId/reupload" component={ReuploadView} />
                        <Route exact path="/upload" component={UploadView} />

                        {/* Review Page containing all Comments + overall Reviews */}
                        <Route exact path="/:paperId/:versionId/reviews" component={ReviewView} />

                        {/* Document and Comments */}
                        {/* <Route exact path="/:paperId" component={DocumentView} /> */}
                        <Route exact path="/:paperId/:versionId" component={DocumentView} />

                        <Route path="*" component={PageNotFound} />

                    </Switch>
                </div>
            </Router>
            </ThemeProvider>
        </StyledEngineProvider>
    );
}

export default App;
