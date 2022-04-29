import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AdminDashboard from "./views/AdminDashboard";
import PageNotFound from "./views/PageNotFound";
import LoginView from "./views/LoginView";
import SharingView from "./views/SharingView";
import { DocumentView } from "./views/DocumentView";
import PapersView from "./views/PapersView";
import ReviewView from "./views/ReviewView";
import ProfileView from "./views/ProfileView";
import UploadView from "./views/UploadView";
import ReuploadView from "./views/ReuploadView";
import SignUp from "./views/SignUpView";
import ProtectedRoute from "./components/ProtectedRoute"
import SearchView from "./views/SearchView";
import SearchCommentView from "./views/SearchCommentView";
import "./App.css";
import { ThemeProvider, StyledEngineProvider, createTheme } from "@mui/material/styles";
import { ProvideAuth } from "./useAuth";
const theme = createTheme();

const App = () => {
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <ProvideAuth>
                    <Router>
                        <div className="mainContainer">
                            <Switch>
                                <Route exact path="/" component={LoginView} />
                                <Route exact path="/signup" component={SignUp} />
                                <ProtectedRoute exact path="/admin" component={AdminDashboard} />
                                <ProtectedRoute exact path="/userprofile" component={ProfileView} />
                                <ProtectedRoute exact path="/papers" component={PapersView} />
                                <ProtectedRoute
                                    exact
                                    path="/:paperId/:versionId/share"
                                    component={SharingView}
                                />
                                <ProtectedRoute exact path="/upload" component={UploadView} />
                                <ProtectedRoute
                                    exact
                                    path="/:paperId/:versionId/reviews"
                                    component={ReviewView}
                                />
                                <ProtectedRoute
                                    exact
                                    path="/:paperId/:versionId/reupload"
                                    component={ReuploadView}
                                />
                                <ProtectedRoute
                                    exact
                                    path="/:paperId/:versionId/search"
                                    component={SearchCommentView}
                                />
                                <ProtectedRoute
                                    exact
                                    path="/:paperId/:versionId"
                                    component={DocumentView}
                                />

                                <ProtectedRoute
                                    exact
                                    path="/search" 
                                    component={SearchView}
                                />
                                
                                <Route path="*" component={PageNotFound} />
                            </Switch>
                        </div>
                    </Router>
                </ProvideAuth>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
