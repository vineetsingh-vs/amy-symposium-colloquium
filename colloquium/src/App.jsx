import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AdminDashboard from "./views/AdminDashboard";
import PageNotFound from "./views/PageNotFound";
import LoginView from "./views/LoginView";
import SharingView from "./views/SharingView";
import DocumentView from "./views/DocumentView";
import MyPapersView from "./views/MyPapersView";
import SharedView from "./views/SharedView";
import PublishView from "./views/PublishView";
import "./App.css";

function App() {
    return (
        <Router>
            <div className="mainContainer">
                <Switch>
                    {/* Admin Page of Users */}
                    <Route exact path="/admin" component={AdminDashboard} />

                    {/* Log in Page */}
                    <Route exact path="/" component={LoginView} />

                    {/* Document and Comments */}
                    <Route exact path="/1" component={DocumentView} />

                    {/* Review Page containing all Comments + overall Reviews */}
                    {/* <Route exact path="/:paperId/reviews" component={ReviewView} /> */}

                    {/* <Route exact path="/:paperId/comments" component={CommentView} /> */}

                    {/* Main User Screens */}
                    <Route exact path="/published" component={PublishView} />
                    <Route exact path="/shared" component={SharedView} />
                    <Route exact path="/mypapers" component={MyPapersView} />

                    {/* "Popup screens" */}
                    <Route exact path="/1/share" component={SharingView} />
                    {/* <Route exact path="/:paperId/reupload" component={ReuploadView} /> */}
                    {/* <Route exact path="/upload" component={UploadPaperView} /> */}

                    <Route path="*" component={PageNotFound} />

                </Switch>
            </div>
        </Router>
    );
}

export default App;
